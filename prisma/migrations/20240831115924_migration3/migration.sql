/*
  Warnings:

  - You are about to drop the `request_status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `request_id` to the `product_master` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "request_status" DROP CONSTRAINT "request_status_product_id_fkey";

-- AlterTable
ALTER TABLE "product_master" ADD COLUMN     "request_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "request_status";

-- CreateTable
CREATE TABLE "compress_request_status" (
    "request_id" SERIAL NOT NULL,
    "file_name" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "compress_request_status_pkey" PRIMARY KEY ("request_id")
);

-- AddForeignKey
ALTER TABLE "product_master" ADD CONSTRAINT "product_master_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "compress_request_status"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;
