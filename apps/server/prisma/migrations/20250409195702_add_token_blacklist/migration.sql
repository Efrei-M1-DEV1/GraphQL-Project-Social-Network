-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_token_key" ON "TokenBlacklist"("token");

-- CreateIndex
CREATE INDEX "Article_createdAt_id_idx" ON "Article"("createdAt", "id");
