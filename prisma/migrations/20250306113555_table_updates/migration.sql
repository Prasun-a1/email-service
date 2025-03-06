/*
  Warnings:

  - You are about to drop the column `orgAdminId` on the `Organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orgAdminEmail]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgAdminEmail` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_orgAdminId_fkey";

-- DropIndex
DROP INDEX "Organization_orgAdminId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "orgAdminId",
ADD COLUMN     "orgAdminEmail" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_OrganizationAdmin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrganizationAdmin_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganizationAdmin_B_index" ON "_OrganizationAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgAdminEmail_key" ON "Organization"("orgAdminEmail");

-- AddForeignKey
ALTER TABLE "_OrganizationAdmin" ADD CONSTRAINT "_OrganizationAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationAdmin" ADD CONSTRAINT "_OrganizationAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
