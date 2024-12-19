/*
  Warnings:

  - A unique constraint covering the columns `[ip,user_agent]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_ip_user_agent_key" ON "Customer"("ip", "user_agent");
