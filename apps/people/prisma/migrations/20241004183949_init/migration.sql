-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "login" VARCHAR(256) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "age" INTEGER NOT NULL,
    "details" VARCHAR(1000) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_login_key" ON "Person"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
