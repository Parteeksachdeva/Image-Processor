import { Queue } from "bullmq";

import { prisma } from "../data-source";
import redisClient from "../redisConfig";

class ImageService {
  private imageQueue: Queue<any>;
  constructor() {
    this.imageQueue = new Queue("imageQueue", { connection: redisClient });
  }

  /**
   * Performs a bulk upload of products and their associated images into the database.
   *
   * This function handles the creation of a new request entry, inserts multiple products,
   * and associates each product with its respective images in a transactional manner.
   * The function returns the inserted products, their request ID, and the associated images.
   *
   * @param {Array<{ product_sku: string }>} products - An array of product data to be inserted, where each object contains a `product_sku`.
   * @param {Map<string, string>} imageMap - A map associating each `product_sku` with a comma-separated string of image URLs.
   * @param {string | null} webhook_url - An optional URL to send notifications about the processing status.
   * @returns {Promise<{ productInsertions: Array<{ product_id: number, product_sku: string }>, request_id: number, imagesData: Array<{ product_id: number, request_id: number, image_url: string }> }>}
   *          A promise that resolves with the request ID, the inserted products, and the associated image data.
   * @throws {Error} - Throws an error if the transaction fails.
   */
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
              request_id,
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
   * Uploads CSV data and initiates the image processing pipeline.
   *
   * This function processes the provided CSV data, maps product SKUs to their respective images,
   * inserts the product and image data into the database, and then starts the image processing
   * by adding the image data to a processing queue.
   *
   * @param {any} sheetData - The parsed data from the CSV file, where each row corresponds to a product with images.
   * @param {string | null} webhook_url - An optional URL to receive notifications about the processing status.
   * @returns {Promise<{ request_id: number }>} - A promise that resolves with the request ID after the upload is initiated.
   * @throws {Error} - Throws an error if the CSV upload or image processing initiation fails.
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
        products.push({ product_sku: row.productName });
        imageMap.set(row.productName, row.inputImageUrls);
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

  /**
   * Retrieves the status of a specific image processing request.
   *
   * This function queries the database to fetch the status of the image processing request
   * associated with the given `request_id`. It returns the request ID, current status,
   * and the webhook URL (if any) where updates might be sent.
   *
   * @param {number} request_id - The unique identifier for the image processing request.
   * @returns {Promise<{ request_id: number, status: string, webhook_url: string | null } | null>}
   *          A promise that resolves with the request data including request ID, status,
   *          and webhook URL, or `null` if no data is found for the given `request_id`.
   */
  public async getRequestStatus(request_id: number): Promise<{
    request_id: number;
    status: string;
    webhook_url: string | null;
  } | null> {
    const requestData = await prisma.compress_request_status.findFirst({
      select: { request_id: true, status: true, webhook_url: true },
      where: { request_id: request_id },
    });

    return requestData;
  }

  /**
   * Retrieves the compressed image data associated with a specific request.
   *
   * This function queries the database to fetch all products and their related images
   * that are associated with the provided `request_id`. It includes both the product
   * information and the corresponding images that have been processed.
   *
   * @param {number} request_id - The unique identifier for the image processing request.
   * @returns {Promise<Array<{ product_id: number, product_sku: string, images: Array<{ id: number, image_url: string, output_url: string | null }> }>>}
   *          A promise that resolves with an array of products and their associated images,
   *          including the URLs of the compressed images (if available).
   */
  public async getCompressedData(request_id: number) {
    const requestData = await prisma.product_master.findMany({
      include: { images: true },
      where: { request_id: request_id },
    });

    return requestData;
  }
}

export default new ImageService();
