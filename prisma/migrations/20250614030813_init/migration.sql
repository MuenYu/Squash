-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "original_name" TEXT NOT NULL,
    "compressed_name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);
