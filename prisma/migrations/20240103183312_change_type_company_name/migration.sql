/*
  Warnings:

  - You are about to drop the `Legal_Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Physical_Person` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Legal_Person" DROP CONSTRAINT "Legal_Person_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Physical_Person" DROP CONSTRAINT "Physical_Person_company_id_fkey";

-- DropTable
DROP TABLE "Legal_Person";

-- DropTable
DROP TABLE "Physical_Person";

-- CreateTable
CREATE TABLE "Physical_Person_Company" (
    "company_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "creci" TEXT NOT NULL,

    CONSTRAINT "Physical_Person_Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Legal_Person_Company" (
    "company_id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "creci_j" TEXT NOT NULL,

    CONSTRAINT "Legal_Person_Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Physical_Person_Company_company_id_key" ON "Physical_Person_Company"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Legal_Person_Company_company_id_key" ON "Legal_Person_Company"("company_id");

-- AddForeignKey
ALTER TABLE "Physical_Person_Company" ADD CONSTRAINT "Physical_Person_Company_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legal_Person_Company" ADD CONSTRAINT "Legal_Person_Company_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
