/*
  Warnings:

  - Made the column `perso_type` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "perso_type" SET NOT NULL;
