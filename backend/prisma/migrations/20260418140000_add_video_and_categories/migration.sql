-- Add videoUrl to posts table
ALTER TABLE "posts" ADD COLUMN "video_url" TEXT;

-- Add videoUrl to feed_posts table
ALTER TABLE "feed_posts" ADD COLUMN "video_url" TEXT;

-- Add new categories (ignore if already exist)
INSERT INTO "categories" ("nome") VALUES
  ('Arte & Criação'),
  ('Casa & Cuidado'),
  ('Transporte'),
  ('Administrativo & Negócios'),
  ('Construção & Técnicos'),
  ('Jurídico'),
  ('Bem-estar & Esporte'),
  ('Eventos & Hospitalidade'),
  ('Saúde'),
  ('Beleza & Estética'),
  ('Moda & Imagem'),
  ('Educação'),
  ('Tecnologia & Digital')
ON CONFLICT (nome) DO NOTHING;
