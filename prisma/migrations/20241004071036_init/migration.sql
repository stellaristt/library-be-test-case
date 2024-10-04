-- CreateTable
CREATE TABLE "Member" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isPenalized" BOOLEAN NOT NULL DEFAULT false,
    "penaltyEndDate" DATETIME
);

-- CreateTable
CREATE TABLE "Book" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "borrowDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "memberCode" TEXT NOT NULL,
    "bookCode" TEXT NOT NULL,
    CONSTRAINT "Transaction_memberCode_fkey" FOREIGN KEY ("memberCode") REFERENCES "Member" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_bookCode_fkey" FOREIGN KEY ("bookCode") REFERENCES "Book" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_code_key" ON "Member"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Book_code_key" ON "Book"("code");
