-- Performance indexes: foreign keys + common filter/sort columns.
-- Postgres does NOT auto-create indexes on FK columns, so joins, cascade
-- deletes, and the public listing queries were doing sequential scans.

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "profiles_ativo_aprovado_created_at_idx" ON "profiles"("ativo", "aprovado", "created_at");

-- CreateIndex
CREATE INDEX "services_profile_id_idx" ON "services"("profile_id");

-- CreateIndex
CREATE INDEX "profile_categories_category_id_idx" ON "profile_categories"("category_id");

-- CreateIndex
CREATE INDEX "reviews_profile_id_idx" ON "reviews"("profile_id");

-- CreateIndex
CREATE INDEX "feed_posts_user_id_idx" ON "feed_posts"("user_id");

-- CreateIndex
CREATE INDEX "feed_posts_publicado_created_at_idx" ON "feed_posts"("publicado", "created_at");

-- CreateIndex
CREATE INDEX "posts_profile_id_idx" ON "posts"("profile_id");

-- CreateIndex
CREATE INDEX "partnerships_lida_created_at_idx" ON "partnerships"("lida", "created_at");
