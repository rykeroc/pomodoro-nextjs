-- CreateTable
CREATE TABLE "quotes" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);
