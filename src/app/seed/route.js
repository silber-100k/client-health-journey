import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function seedTemplate() {
  // Use pgcrypto for gen_random_uuid()
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE "Template" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" VARCHAR(255),
        "description" TEXT
    );
  `;
}

async function seedClinic() {
  // Use pgcrypto for gen_random_uuid()
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await sql`
    CREATE TABLE "Clinic" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        "phoneNumber" VARCHAR(50),
        "primaryContact" VARCHAR(255),
        "streetAddress" VARCHAR(255),
        "city" VARCHAR(100),
        "state" VARCHAR(100),
        "zipCode" VARCHAR(20),
        "addOns" TEXT[],
        "hipaaAcknowledgment" BOOLEAN,
        "legalAcknowledgment" BOOLEAN,
        "customerId" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        -- "coaches" and "clients" handled via join tables below
    );
  `;
}

const crypto = require('crypto');

function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
}

async function seedUser() {
  // Use pgcrypto for gen_random_uuid()
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  // Create the User table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS "User" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL CHECK ("role" IN ('admin', 'coach', 'client', 'clinic_admin')),
        "clinic" UUID REFERENCES "Clinic"("id"),
        "name" VARCHAR(255) NOT NULL,
        "phoneNumber" VARCHAR(50),
        "image" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT TRUE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "salt" VARCHAR(255),
        "coachId" UUID
    );
  `;
  const salt = generateSalt();
  const hashedPassword = hashPassword("password123", salt);

  await sql`
    INSERT INTO "User" ("id", "name", "email", "password", "salt", "role")
    VALUES (gen_random_uuid(), 'admin', 'drrelth@contourlight.com', ${hashedPassword}, ${salt}, 'admin')
    ON CONFLICT ("email") DO NOTHING;
  `;
}




async function seedProgram() {
  await sql`
    CREATE TABLE "Program" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255),
        "type" VARCHAR(255),
        "duration" VARCHAR(255),
        "checkInFrequency" VARCHAR(255),
        "description" TEXT,
        "tempId" UUID REFERENCES "Template"("id"),
        "clinicId" UUID REFERENCES "Clinic"("id"),
        "all" VARCHAR(255)
    );
  `;
}

async function seedResource() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Resource" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" VARCHAR(255),
      "description" VARCHAR(255),
      "role" VARCHAR(255),
      "type" VARCHAR(255),
      "category" VARCHAR(255),
      "isNew" BOOLEAN DEFAULT FALSE, 
      "content" TEXT,
      "uploadDate" TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;
}


async function seedClient() {
  await sql`
    CREATE TABLE "Client" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "phone" VARCHAR(50),
        "programId" UUID REFERENCES "Program"("id"),
        "programCategory" VARCHAR(255),
        "startDate" DATE,
        "notes" TEXT,
        "coachId" UUID REFERENCES "User"("id"),
        "clinic" UUID REFERENCES "Clinic"("id"),
        "weightDate" DATE,
        "initialWeight" NUMERIC,
        "lastCheckIn" DATE,
        "goals" TEXT[]
    );
  `;
}

async function seedCheckIn() {
  await sql`
    CREATE TABLE "CheckIn" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "coachId" UUID REFERENCES "User"("id"),
        "clinic" UUID REFERENCES "Clinic"("id"),
        "selectedDate" DATE,
        "weight" NUMERIC,
        "waist" NUMERIC,
        "waterIntake" VARCHAR(255),
        "energyLevel" NUMERIC,
        "moodLevel" NUMERIC,
        "exerciseType" VARCHAR(255),
        "exercise" VARCHAR(255),
        "exerciseTime" VARCHAR(255),
        "sleepHours" VARCHAR(255),
        "breakfastProtein" VARCHAR(255),
        "breakfastProteinPortion" VARCHAR(255),
        "breakfastFruit" VARCHAR(255),
        "breakfastFruitPortion" VARCHAR(255),
        "breakfastVegetable" VARCHAR(255),
        "breakfastVegetablePortion" VARCHAR(255),
        "lunchProtein" VARCHAR(255),
        "lunchProteinPortion" VARCHAR(255),
        "lunchFruit" VARCHAR(255),
        "lunchFruitPortion" VARCHAR(255),
        "lunchVegetable" VARCHAR(255),
        "lunchVegetablePortion" VARCHAR(255),
        "dinnerProtein" VARCHAR(255),
        "dinnerProteinPortion" VARCHAR(255),
        "dinnerFruit" VARCHAR(255),
        "dinnerFruitPortion" VARCHAR(255),
        "dinnerVegetable" VARCHAR(255),
        "dinnerVegetablePortion" VARCHAR(255),
        "snacks" VARCHAR(255),
        "snackPortion" VARCHAR(255),
        "supplements" VARCHAR(255),
        "notes" TEXT
    );
  `;
}

async function seedMessage() {
  await sql`
    CREATE TABLE "Message" (
        "id" VARCHAR(255) PRIMARY KEY,
        "message" TEXT NOT NULL,
        "receiver" VARCHAR(255) NOT NULL,
        "sender" VARCHAR(255) NOT NULL,
        "status" VARCHAR(255) NOT NULL,
        "timeStamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

async function seedNotification() {
  await sql`
    CREATE TABLE "Notification" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL,
        "unreadCount" NUMERIC DEFAULT 0
    );
  `;
}

async function seedActivity() {
  await sql`
    CREATE TABLE "Activity" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "type" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "clinicId" UUID,
        "timeStamp" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

async function seedSubscriptionTier() {
  await sql`
    CREATE TABLE "SubscriptionTier" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "clinicId" UUID NOT NULL UNIQUE REFERENCES "Clinic"("id"),
        "planId" VARCHAR(255) NOT NULL,
        "customerId" VARCHAR(255) NOT NULL UNIQUE,
        "subscriptionId" VARCHAR(255),
        "startDate" DATE,
        "endDate" DATE,
        "isActive" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

async function SubscriptionHistory() {
  await sql`
    CREATE TABLE "SubscriptionHistory" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "clinicId" UUID NOT NULL REFERENCES "Clinic"("id"),
        "subscriptionId" UUID NOT NULL UNIQUE REFERENCES "SubscriptionTier"("id"),
        "paymentAmount" NUMERIC,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedTemplate();
      await seedClinic();
      await seedUser();
      await seedProgram();
      await seedClient();
      await seedCheckIn();
      await seedMessage();
      await seedNotification();
      await seedActivity();
      await seedSubscriptionTier();
      await SubscriptionHistory();
      await seedResource();
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
