-- CreateTable
CREATE TABLE "DassResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "depressionRaw" INTEGER NOT NULL,
    "anxietyRaw" INTEGER NOT NULL,
    "stressRaw" INTEGER NOT NULL,
    "depressionScore" INTEGER NOT NULL,
    "anxietyScore" INTEGER NOT NULL,
    "stressScore" INTEGER NOT NULL,
    "depressionSeverity" TEXT NOT NULL,
    "anxietySeverity" TEXT NOT NULL,
    "stressSeverity" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DassResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DassResult_userId_idx" ON "DassResult"("userId");

-- CreateIndex
CREATE INDEX "DassResult_takenAt_idx" ON "DassResult"("takenAt");

-- AddForeignKey
ALTER TABLE "DassResult" ADD CONSTRAINT "DassResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
