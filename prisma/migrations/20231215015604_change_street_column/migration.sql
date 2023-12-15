/*
  Warnings:

  - You are about to drop the column `steet_n` on the `User_Adress` table. All the data in the column will be lost.
  - Added the required column `street_n` to the `User_Adress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Adress" DROP COLUMN "steet_n",
ADD COLUMN     "street_n" TEXT NOT NULL;
