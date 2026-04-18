-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "titulo" VARCHAR(200),
    "conteudo" TEXT,
    "imagem_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
