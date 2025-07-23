-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'TRIAL');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'RAZORPAY', 'PAYPAL');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "paymentProvider" "PaymentProvider",
    "providerSubscriptionId" TEXT,
    "providerCustomerId" TEXT,
    "priceId" TEXT,
    "amount" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'INR',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "billingCycle" TEXT,
    "canAccessCompanySheets" BOOLEAN NOT NULL DEFAULT false,
    "canAccessAIAnalysis" BOOLEAN NOT NULL DEFAULT false,
    "maxProblemsPerMonth" INTEGER NOT NULL DEFAULT 50,
    "maxAIAnalysisPerMonth" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "paymentProvider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "providerInvoiceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "description" TEXT,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "currentMonth" INTEGER NOT NULL DEFAULT 1,
    "currentYear" INTEGER NOT NULL DEFAULT 2024,
    "problemsSolvedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "aiAnalysisUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
    "companySheetAccessCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyUsageHistory" JSONB NOT NULL DEFAULT '{}',
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "logoUrl" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "requiredPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySheetProblem" (
    "id" TEXT NOT NULL,
    "companySheetId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "lastAskedDate" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanySheetProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageTracker_userId_key" ON "UsageTracker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageTracker_subscriptionId_key" ON "UsageTracker"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanySheet_slug_key" ON "CompanySheet"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CompanySheetProblem_companySheetId_problemId_key" ON "CompanySheetProblem"("companySheetId", "problemId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageTracker" ADD CONSTRAINT "UsageTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageTracker" ADD CONSTRAINT "UsageTracker_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySheetProblem" ADD CONSTRAINT "CompanySheetProblem_companySheetId_fkey" FOREIGN KEY ("companySheetId") REFERENCES "CompanySheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySheetProblem" ADD CONSTRAINT "CompanySheetProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
