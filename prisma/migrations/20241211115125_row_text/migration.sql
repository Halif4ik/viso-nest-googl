/*
  Warnings:

  - You are about to drop the column `editable` on the `Row` table. All the data in the column will be lost.
  - Added the required column `text` to the `Row` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Row" DROP COLUMN "editable",
ADD COLUMN     "text" TEXT NOT NULL;
