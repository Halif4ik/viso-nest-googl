-- CreateTable
CREATE TABLE "Row" (
    "id" SERIAL NOT NULL,
    "row_sheets" INTEGER NOT NULL,
    "column_sheets" TEXT NOT NULL,
    "editable" BOOLEAN,
    "empty" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("id")
);
