-- CreateTable
CREATE TABLE "Visited_Page" (
    "user_id" TEXT NOT NULL,
    "dashboard" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Visited_Page_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visited_Page_user_id_key" ON "Visited_Page"("user_id");

-- AddForeignKey
ALTER TABLE "Visited_Page" ADD CONSTRAINT "Visited_Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
