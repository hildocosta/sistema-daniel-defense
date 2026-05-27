-- CreateTable
CREATE TABLE "materiais_belicos" (
    "id" TEXT NOT NULL,
    "tipoMaterial" TEXT NOT NULL,
    "serie" TEXT,
    "patrimonio" TEXT,
    "lote" TEXT,
    "equipamento" TEXT NOT NULL,
    "calibre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cia" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Operacional',
    "responsavel" TEXT,
    "quantidadeTotal" INTEGER NOT NULL DEFAULT 1,
    "almoxarifado" INTEGER NOT NULL DEFAULT 0,
    "distribuido" INTEGER NOT NULL DEFAULT 0,
    "dataFabricacao" TIMESTAMP(3),
    "dataValidade" TIMESTAMP(3),
    "documentoAmparo" TEXT,
    "observacoes" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiais_belicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historicos_movimentacao" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'info',
    "quantidadeMov" INTEGER NOT NULL DEFAULT 1,
    "origemMov" TEXT,
    "materialBelicoId" TEXT NOT NULL,
    "usuarioId" TEXT,

    CONSTRAINT "historicos_movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios_sistema" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_sistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "materiais_belicos_serie_key" ON "materiais_belicos"("serie");

-- CreateIndex
CREATE UNIQUE INDEX "materiais_belicos_patrimonio_key" ON "materiais_belicos"("patrimonio");

-- CreateIndex
CREATE INDEX "historicos_movimentacao_materialBelicoId_idx" ON "historicos_movimentacao"("materialBelicoId");

-- CreateIndex
CREATE INDEX "historicos_movimentacao_usuarioId_idx" ON "historicos_movimentacao"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_sistema_email_key" ON "usuarios_sistema"("email");

-- AddForeignKey
ALTER TABLE "historicos_movimentacao" ADD CONSTRAINT "historicos_movimentacao_materialBelicoId_fkey" FOREIGN KEY ("materialBelicoId") REFERENCES "materiais_belicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicos_movimentacao" ADD CONSTRAINT "historicos_movimentacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios_sistema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
