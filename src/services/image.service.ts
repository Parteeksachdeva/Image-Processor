import xlsx from "xlsx";

import { prisma } from "../data-source";

class ImageService {
  //   private contactRepository: Repository<Contact>;
  constructor() {
    // this.contactRepository = AppDataSource.getRepository(Contact);
  }

  /**
   *
   *
   * @returns {} - The consolidated contact information.
   * @throws {Error} - Throws an error if the contact identification process fails.
   */
  public async uploadCsvAndStartProcessing(excelBuffer: Buffer) {
    try {
      const workbook = xlsx.read(excelBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      console.log({ sheetData });

      //Write data with transaction
      //   const product = await prisma.product_master.create({
      //     data: {
      //       product_sku: "1234567",
      //       webhook_url: "123",
      //       images: {
      //         create: [
      //           { image_url: "https://example.com/image1.jpg" },
      //           { image_url: "https://example.com/image2.jpg" },
      //         ],
      //       },
      //       request_status: {
      //         create: {
      //           status: "pending",
      //         },
      //       },
      //     },
      //   });

      const a = await prisma.product_master.findMany();
      const b = await prisma.image_product_mapping.findMany();
      const c = await prisma.request_status.findMany();

      return { a, b, c };
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ImageService();
