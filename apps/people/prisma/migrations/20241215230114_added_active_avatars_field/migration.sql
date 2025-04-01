-- AlterTable
ALTER TABLE "Person"
    ADD COLUMN "activeAvatars" INTEGER NOT NULL DEFAULT 0;

-- Add a CHECK constraint
ALTER TABLE "Person"
    ADD CONSTRAINT "max_person_active_avatars_check" CHECK ("activeAvatars" <= 5);