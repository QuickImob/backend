/*
  Warnings:

  - Added the required column `perso_type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "perso_type" TEXT NOT NULL;
