import { Job, Worker } from "bullmq";
import redisClient from "../redisConfig";

class CompressionService {
  private worker: Worker<any, any, string>;

  constructor() {
    this.worker = new Worker(
      "imageQueue",
      async (job: Job) => {
        console.log("Processing job:", job.id, job.data);

        await this.processImage(job.data.image);

        return "Images processed successfully";
      },
      {
        connection: redisClient,
        autorun: true,
      }
    );

    this.worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed successfully.`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed with error ${err.message}`);
    });
  }

  private async processImage(image: string): Promise<void> {
    console.log("Processing image:", image);
    await new Promise((resolve) => setTimeout(resolve, 20000));
    console.log("Image processed:", image);
  }
}

export default CompressionService;
