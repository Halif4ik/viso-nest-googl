/*
  Warnings:

  - You are about to drop the column `info` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `ip` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_info_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "info",
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL;
