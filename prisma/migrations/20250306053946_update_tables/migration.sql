/*
  Warnings:

  - You are about to drop the `_OrganizationUsers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orgAdminId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgAdminId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationUsers" DROP CONSTRAINT "_OrganizationUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationUsers" DROP CONSTRAINT "_OrganizationUsers_B_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "orgAdminId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_OrganizationUsers";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgAdminId_key" ON "Organization"("orgAdminId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_orgAdminId_fkey" FOREIGN KEY ("orgAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
