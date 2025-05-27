import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function createformattedtext(title, description, role, category, type, content) {
  const [text] = await sql`
    INSERT INTO "Resource" ("title", "description", "role","category", "type", "content")
    VALUES (${title}, ${description}, ${role}, ${category}, ${type}, ${content})
    RETURNING *
  `;
  return text;
}

async function getAllTexts() {
  const texts = await sql`
    SELECT * FROM "Resource"
    WHERE "type" = 'HTML';
  `;
  return texts;
}


async function updateResource(id, title, description, role, category, type, content) {
  const [resource] = await sql`
    UPDATE "Resource" SET "title" = ${title}, "description" = ${description}, "role" = ${role}, "category" = ${category}, "type" = ${type}, "content" = ${content} WHERE "id" = ${id}
  `;
  return resource;
}

async function deleteResource(id) {
  const [resource] = await sql`
    DELETE FROM "Resource" WHERE "id" = ${id}
  `;
  return resource;
}

async function getAllDocs() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "type" = 'Doc';
`;
  return texts;
}

async function getAllTextsForClinic() {
  const texts = await sql`
    SELECT * FROM "Resource"
    WHERE "role" IN ('clinic', 'all') AND "type" = 'HTML';
  `;
  return texts;
}

async function getAllTextsForCoach() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('coach', 'all') AND "type" = 'HTML';  `;
  return texts;
}

async function getAllTextsForClient() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('client', 'all') AND "type" IN ('HTML', 'Doc');  `;
  return texts;
}

async function getAllDocsForClinic() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('clinic', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

async function getAllDocsForCoach() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('coach', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

async function getAllDocsForClient() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('client', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

export const resourceRepo = {
  createformattedtext,
  getAllTexts,
  updateResource,
  deleteResource,
  getAllDocs,
  getAllTextsForClinic,
  getAllTextsForCoach,
  getAllTextsForClient,
  getAllDocsForClinic,
  getAllDocsForCoach,
  getAllDocsForClient,
}