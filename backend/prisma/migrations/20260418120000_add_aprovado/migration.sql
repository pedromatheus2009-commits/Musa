ALTER TABLE "profiles" ADD COLUMN "aprovado" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ALTER COLUMN "aprovado" SET DEFAULT false;
