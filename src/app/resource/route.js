import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });


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



export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedResource();
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
