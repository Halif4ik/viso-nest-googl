/*
  Warnings:

  - A unique constraint covering the columns `[row_sheets,column_sheets]` on the table `Row` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Row_row_sheets_column_sheets_key" ON "Row"("row_sheets", "column_sheets");
