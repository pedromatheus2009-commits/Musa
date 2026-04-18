CREATE TABLE "partnerships" (
  "id" TEXT NOT NULL,
  "nome" VARCHAR(200) NOT NULL,
  "empresa" VARCHAR(200) NOT NULL,
  "email" VARCHAR(200) NOT NULL,
  "tipo" VARCHAR(100) NOT NULL,
  "mensagem" TEXT NOT NULL,
  "lida" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id")
);
