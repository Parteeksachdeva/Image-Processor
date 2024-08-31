import { Queue } from "bullmq";

import { prisma } from "../data-source";
import redisClient from "../redisConfig";

class ImageService {
  private imageQueue: Queue<any>;
  constructor() {
    this.imageQueue = new Queue("imageQueue", { connection: redisClient });
  }

  private async bulkUpload(
    products: { product_sku: string }[],
    imageMap: Map<string, string>
  ) {
    try {
      const insertedProducts = await prisma.$transaction(async (tx) => {
        const requestData = await tx.compress_request_status.create({
          data: { file_name: "Sheet 1" },
        });

        const request_id = requestData.request_id;

        const productInsertions = await tx.product_master.createManyAndReturn({
          data: products.map((p) => ({ ...p, request_id })),
          skipDuplicates: true,
        });

        const imagesData = [];

        productInsertions.forEach((c) => {
          const _images = imageMap.get(c.product_sku).split(",");
          _images.forEach((image_url) => {
            imagesData.push({
              product_id: c.product_id,
              image_url,
            });
          });
        });

        await tx.image_product_mapping.createMany({
          data: imagesData,
        });

        return { productInsertions, request_id };
      });

      console.log(
        `Bulk upload completed successfully. ${insertedProducts.productInsertions.length} products inserted.`
      );

      return insertedProducts.request_id;
    } catch (error) {
      console.error("Error during bulk upload:", error);
    }
  }

  /**
   *
   *
   * @returns {} - The consolidated contact information.
   * @throws {Error} - Throws an error if the contact identification process fails.
   */
  public async uploadCsvAndStartProcessing(sheetData) {
    try {
      const products = [];
      const imageMap = new Map();
      const inputImages = [];
      for (const row of sheetData) {
        products.push({ product_sku: row.productName });
        imageMap.set(row.productName, row.inputImageUrls);
        inputImages.push(...row.inputImageUrls.split(","));
      }

      //Todo: Add batch processing
      const request_id = await this.bulkUpload(products, imageMap);

      //dump image data to be processed
      for (const image of inputImages) {
        await this.imageQueue.add("imageQueue", {
          image,
          request_id,
        });
      }

      return { request_id };
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ImageService();
