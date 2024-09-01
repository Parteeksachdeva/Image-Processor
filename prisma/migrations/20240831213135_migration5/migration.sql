/*
  Warnings:

  - Added the required column `request_id` to the `image_product_mapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "image_product_mapping" ADD COLUMN     "request_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "image_product_mapping" ADD CONSTRAINT "image_product_mapping_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "compress_request_status"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
