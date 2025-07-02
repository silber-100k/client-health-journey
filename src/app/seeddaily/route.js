import { sql } from "../lib/db/postgresql";

async function seedDailyMessage() {
  await sql`
    CREATE TABLE IF NOT EXISTS "DailyMessage" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID REFERENCES "User"("id"),
      "date" DATE NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE ("userId", "date")
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedDailyMessage();
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
