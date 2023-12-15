/*
  Warnings:

  - Added the required column `updated_at` to the `User_Adress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Adress" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "id_extern" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "property_registration" TEXT,
    "condominium" DECIMAL(10,2),
    "iptu" DECIMAL(10,2),
    "id_owner" TEXT,
    "constructed_area" TEXT,
    "total_area" TEXT,
    "sell_price" DECIMAL(10,2),
    "rent_price" DECIMAL(10,2),
    "objective" TEXT,
    "n_bedrooms" INTEGER,
    "n_suites" INTEGER,
    "n_bathrooms" INTEGER,
    "n_parking" INTEGER,
    "n_parking_free" INTEGER,
    "n_washrooms" INTEGER,
    "n_elevators" INTEGER,
    "n_paviments" INTEGER,
    "link_tour" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_user_id_key" ON "Company"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_user_id_key" ON "Property"("user_id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
