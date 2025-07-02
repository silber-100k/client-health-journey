import { sql } from '../lib/db/postgresql';

async function seedMicroNutrients() {
  await sql`
    CREATE TABLE "MicroNutrients" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL,
        "content" JSONB,
        "createdAt" DATE
    );
  `;
}




export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedMicroNutrients();
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message || error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
