-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Person"
    ADD COLUMN "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[];

-- CreateTable
CREATE TABLE "Avatar"
(
    "path" VARCHAR(256) NOT NULL,
    "name"      VARCHAR(256) NOT NULL,
    "personId" VARCHAR(256) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_path_key" ON "Avatar" ("path");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "Avatar" ("name");

-- AddForeignKey
ALTER TABLE "Avatar"
    ADD CONSTRAINT "Avatar_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
