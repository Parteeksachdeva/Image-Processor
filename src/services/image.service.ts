// import { QueryRunner, Repository } from "typeorm";
// import { AppDataSource } from "../data-source";
// import { Contact } from "../entity/Contact";

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
  public async uploadCsvAndStartProcessing() {
    try {
      return "Hello";
    } catch (error) {
      console.error(error);
    }
  }
}

export default new ImageService();
