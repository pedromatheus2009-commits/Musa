-- CreateTable
CREATE TABLE "bau_itens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "descricao" TEXT,
    "preco" INTEGER,
    "tipo" TEXT NOT NULL,
    "categoria" TEXT,
    "fotos" TEXT[],
    "whatsapp" VARCHAR(20) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bau_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bau_itens_status_created_at_idx" ON "bau_itens"("status", "created_at");

-- CreateIndex
CREATE INDEX "bau_itens_user_id_idx" ON "bau_itens"("user_id");

-- AddForeignKey
ALTER TABLE "bau_itens" ADD CONSTRAINT "bau_itens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
