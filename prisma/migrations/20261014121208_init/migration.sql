-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'MANAGER');

-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'MANAGER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KZT',
    "oldPrice" DECIMAL(10,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "status" "TourStatus" NOT NULL DEFAULT 'DRAFT',
    "whatsappOverride" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tours_slug_key" ON "tours"("slug");

-- CreateIndex
CREATE INDEX "tours_isHot_status_idx" ON "tours"("isHot", "status");

-- CreateIndex
CREATE INDEX "tours_status_startDate_idx" ON "tours"("status", "startDate");

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
