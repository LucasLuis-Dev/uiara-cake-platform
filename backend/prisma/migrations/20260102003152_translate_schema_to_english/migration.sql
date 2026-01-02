/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Encomenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sabor` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('PP', 'P', 'M', 'G', 'GG');

-- CreateEnum
CREATE TYPE "FlavorType" AS ENUM ('FILLING', 'DOUGH');

-- CreateEnum
CREATE TYPE "CoverageType" AS ENUM ('CHANTILLY', 'GANACHE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Encomenda" DROP CONSTRAINT "Encomenda_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Encomenda" DROP CONSTRAINT "Encomenda_massaId_fkey";

-- DropForeignKey
ALTER TABLE "Encomenda" DROP CONSTRAINT "Encomenda_recheioId_fkey";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Encomenda";

-- DropTable
DROP TABLE "Sabor";

-- DropEnum
DROP TYPE "StatusEncomenda";

-- DropEnum
DROP TYPE "Tamanho";

-- DropEnum
DROP TYPE "TipoCobertura";

-- DropEnum
DROP TYPE "TipoSabor";

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FlavorType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "filling_id" TEXT NOT NULL,
    "dough_id" TEXT NOT NULL,
    "size" "Size" NOT NULL,
    "coverage_type" "CoverageType" NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "total_value" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_filling_id_fkey" FOREIGN KEY ("filling_id") REFERENCES "flavors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_dough_id_fkey" FOREIGN KEY ("dough_id") REFERENCES "flavors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
