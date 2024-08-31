-- CreateTable
CREATE TABLE "product_master" (
    "product_id" SERIAL NOT NULL,
    "product_sku" TEXT NOT NULL,
    "webhook_url" TEXT NOT NULL,

    CONSTRAINT "product_master_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "image_product_mapping" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "output_url" TEXT,

    CONSTRAINT "image_product_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_status" (
    "request_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "request_status_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_master_product_sku_key" ON "product_master"("product_sku");

-- AddForeignKey
ALTER TABLE "image_product_mapping" ADD CONSTRAINT "image_product_mapping_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_master"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_status" ADD CONSTRAINT "request_status_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_master"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
