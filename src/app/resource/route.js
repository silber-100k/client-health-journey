import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });


async function aiReview() {
  await sql`
    CREATE TABLE "AIReview" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL,
        "content" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
}



export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await aiReview();
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
