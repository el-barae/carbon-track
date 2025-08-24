-- CreateTable
CREATE TABLE "public"."Credit" (
    "id" SERIAL NOT NULL,
    "projectId" TEXT NOT NULL,
    "vintage" TEXT NOT NULL,
    "certifier" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "owner" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "footprint" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "public"."User"("wallet");
