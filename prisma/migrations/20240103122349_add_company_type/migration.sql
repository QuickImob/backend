-- CreateTable
CREATE TABLE "Physical_Person" (
    "company_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "creci" TEXT NOT NULL,

    CONSTRAINT "Physical_Person_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Legal_Person" (
    "company_id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "creci_j" TEXT NOT NULL,

    CONSTRAINT "Legal_Person_pkey" PRIMARY KEY ("company_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Physical_Person_company_id_key" ON "Physical_Person"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Legal_Person_company_id_key" ON "Legal_Person"("company_id");

-- AddForeignKey
ALTER TABLE "Physical_Person" ADD CONSTRAINT "Physical_Person_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legal_Person" ADD CONSTRAINT "Legal_Person_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
