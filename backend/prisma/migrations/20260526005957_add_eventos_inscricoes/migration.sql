-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "duracao_min" INTEGER,
    "local" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "link_online" TEXT,
    "preco" INTEGER NOT NULL,
    "vagas" INTEGER NOT NULL,
    "imagem_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscricoes" (
    "id" TEXT NOT NULL,
    "evento_id" TEXT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aguardando_pagamento',
    "origem" TEXT NOT NULL DEFAULT 'online',
    "valor_pago" INTEGER,
    "stripe_session_id" TEXT,
    "hold_expires_at" TIMESTAMP(3),
    "lembrete_enviado_em" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscricoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventos_status_data_hora_idx" ON "eventos"("status", "data_hora");

-- CreateIndex
CREATE INDEX "eventos_created_by_id_idx" ON "eventos"("created_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_stripe_session_id_key" ON "inscricoes"("stripe_session_id");

-- CreateIndex
CREATE INDEX "inscricoes_evento_id_status_idx" ON "inscricoes"("evento_id", "status");

-- CreateIndex
CREATE INDEX "inscricoes_status_hold_expires_at_idx" ON "inscricoes"("status", "hold_expires_at");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
