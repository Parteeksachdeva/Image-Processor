import { Queue } from "bullmq";

import { prisma } from "../data-source";
import redisClient from "../redisConfig";
import axios from "axios";

class CronService {
  constructor() {}

  async changeRequestStatus() {
    console.log("Starting of change request status");
    const requests = await prisma.compress_request_status.findMany({
      where: { status: "PENDING" },
    });

    for (let request of requests) {
      const images = await prisma.image_product_mapping.findMany({
        where: { request_id: request.request_id, output_url: null },
      });

      console.log({ images });

      if (!images.length) {
        await prisma.compress_request_status.update({
          data: { status: "COMPLETED" },
          where: { request_id: request.request_id },
        });

        //call webhook
        if (request?.webhook_url) {
          console.log("Webhook called");
          await axios({
            method: "post",
            url: request.webhook_url,
            data: { request_id: request.request_id, status: "COMPLETED" },
          });
        }
      }
    }

    setTimeout(() => this.changeRequestStatus(), 5000);
  }
}

export default CronService;
