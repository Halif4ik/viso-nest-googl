-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "info" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_info_key" ON "Customer"("info");
