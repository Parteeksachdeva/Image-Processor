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
    imageMap: Map<string, string>,
    webhook_url: string | null
  ) {
    try {
      const insertedProducts = await prisma.$transaction(async (tx) => {
        const requestData = await tx.compress_request_status.create({
          data: { file_name: "Sheet 1", webhook_url }, //Todo: Change name to actual filename
        });

        const request_id = requestData.request_id;

        const productInsertions = await tx.product_master.createManyAndReturn({
          data: products.map((p) => ({ ...p, request_id })),
          skipDuplicates: true,
        });

        const _imagesData = [];

        productInsertions.forEach((c) => {
          const _images = imageMap.get(c.product_sku).split(",");
          _images.forEach((image_url) => {
            _imagesData.push({
              product_id: c.product_id,
              image_url,
            });
          });
        });

        const imagesData = await tx.image_product_mapping.createManyAndReturn({
          data: _imagesData,
        });

        return { productInsertions, request_id, imagesData };
      });

      console.log(
        `Bulk upload completed successfully. ${insertedProducts.productInsertions.length} products inserted.`
      );

      return {
        request_id: insertedProducts.request_id,
        productInsertions: insertedProducts.productInsertions,
        imagesData: insertedProducts.imagesData,
      };
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
  public async uploadCsvAndStartProcessing(
    sheetData: any,
    webhook_url = null
  ): Promise<{ request_id: number }> {
    try {
      const products = [];
      const imageMap = new Map();
      const inputImages = [];
      for (const row of sheetData) {
        products.push({ product_sku: row.productName + "999" });
        imageMap.set(row.productName + "999", row.inputImageUrls);
      }

      //Todo: Add batch processing
      const { request_id, productInsertions, imagesData } =
        await this.bulkUpload(products, imageMap, webhook_url);

      for (const row of imagesData) {
        inputImages.push(
          ...row.image_url.split(",").map((r) => ({
            image: r,
            request_id,
            product_id: row.product_id,
            image_id: row.id,
          }))
        );
      }

      console.log({ imagesData });

      //dump image data to be processed
      for (const image of inputImages) {
        await this.imageQueue.add("imageQueue", image);
      }

      return { request_id };
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ImageService();
