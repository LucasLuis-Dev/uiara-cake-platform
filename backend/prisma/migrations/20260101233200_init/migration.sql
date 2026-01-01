-- CreateEnum
CREATE TYPE "TipoSabor" AS ENUM ('RECHEIO', 'MASSA');

-- CreateEnum
CREATE TYPE "Tamanho" AS ENUM ('PP', 'P', 'M', 'G', 'GG');

-- CreateEnum
CREATE TYPE "TipoCobertura" AS ENUM ('CHANTINHO', 'GANACHE');

-- CreateEnum
CREATE TYPE "StatusEncomenda" AS ENUM ('PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE', 'CANCELADO');

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "endereco" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sabor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoSabor" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sabor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encomenda" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tamanho" "Tamanho" NOT NULL,
    "tipoCobertura" "TipoCobertura" NOT NULL,
    "diametroCm" INTEGER NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "topoIncluso" BOOLEAN NOT NULL DEFAULT false,
    "recheioId" TEXT NOT NULL,
    "massaId" TEXT NOT NULL,
    "dataPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEntrega" TIMESTAMP(3) NOT NULL,
    "antecedenciaDias" INTEGER NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorEntrada" DOUBLE PRECISION NOT NULL,
    "saldoRestante" DOUBLE PRECISION NOT NULL,
    "entradaPaga" BOOLEAN NOT NULL DEFAULT false,
    "saldoPago" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusEncomenda" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "googleCalendarEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encomenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cliente_nome_idx" ON "Cliente"("nome");

-- CreateIndex
CREATE INDEX "Encomenda_clienteId_idx" ON "Encomenda"("clienteId");

-- CreateIndex
CREATE INDEX "Encomenda_dataEntrega_idx" ON "Encomenda"("dataEntrega");

-- CreateIndex
CREATE INDEX "Encomenda_status_idx" ON "Encomenda"("status");

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_recheioId_fkey" FOREIGN KEY ("recheioId") REFERENCES "Sabor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encomenda" ADD CONSTRAINT "Encomenda_massaId_fkey" FOREIGN KEY ("massaId") REFERENCES "Sabor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
