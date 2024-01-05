/*
  Warnings:

  - You are about to drop the column `id_owner` on the `Property` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "id_owner",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
