/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobileNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `college` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobileNo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "fullName",
ADD COLUMN     "college" TEXT NOT NULL,
ADD COLUMN     "mobileNo" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'student';

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNo_key" ON "User"("mobileNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
