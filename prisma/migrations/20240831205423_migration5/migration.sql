/*
  Warnings:

  - You are about to drop the column `webhook_url` on the `product_master` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "compress_request_status" ADD COLUMN     "webhook_url" TEXT;

-- AlterTable
ALTER TABLE "product_master" DROP COLUMN "webhook_url";
