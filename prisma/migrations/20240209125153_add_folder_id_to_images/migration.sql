-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_folder_id_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
