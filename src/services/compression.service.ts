import { Job, Worker } from "bullmq";
import sharp from "sharp";
import axios from "axios";
import AWS from "aws-sdk";
import path from "path";

import redisClient from "../redisConfig";
import { prisma } from "../data-source";

class CompressionService {
  private worker: Worker<any, any, string>;
  private s3: AWS.S3;

  constructor() {
    this.worker = new Worker(
      "imageQueue",
      async (job: Job) => {
        console.log("Processing job:", job.id, job.data);

        await this.processImage(
          job.data.image,
          job.data.request_id,
          job.data.product_id,
          job.data.image_id
        );

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

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    });
  }

  private async processImage(
    image: string,
    request_id: number,
    product_id: number,
    image_id: number
  ): Promise<void> {
    console.log("Processing image:", image);
    let imageBuffer = (await axios({ url: image, responseType: "arraybuffer" }))
      .data as Buffer;

    const _image = sharp(imageBuffer);
    const meta = await _image.metadata();
    const { format } = meta;

    console.log({ format });

    const config = {
      jpeg: { quality: 50 },
      webp: { quality: 50 },
      avif: { quality: 50 },
      png: { compressionLevel: 5, quality: 50, force: true },
    };

    const processedImageBuffer = await _image[format](
      config[format] || { quality: 50 }
    ).toBuffer();

    const fileName = path.basename(image);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: request_id + "/" + product_id + "/" + image_id + "-" + fileName,
      Body: processedImageBuffer,
      ContentType: `image/${format}`,
    };

    const uploadResponse = await this.s3.upload(params).promise();
    const output_image = uploadResponse.Location;
    console.log("Image uploaded successfully to S3", output_image);

    console.log(
      "before size",
      imageBuffer.length,
      "after compression size",
      processedImageBuffer.length,
      "compressed percentage",
      Math.floor((1 - processedImageBuffer.length / imageBuffer.length) * 100)
    );

    await prisma.image_product_mapping.update({
      data: { output_url: output_image },
      where: { id: image_id },
    });

    console.log("Image processed:", image);
  }
}

export default CompressionService;
