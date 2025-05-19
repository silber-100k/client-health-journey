import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

/**
 * Get all programs for a given clinic with client counts
 * Includes joining with Template table for template details
 */
async function getPrograms(clinicId) {
  // Get all programs for the clinic with template info
  const programs = await sql`
  SELECT 
    p.*,
    row_to_json(t) AS template
  FROM "Program" p
  LEFT JOIN "Template" t ON p."tempId" = t."id"
  WHERE p."clinicId" = ${clinicId}
`;

  // Get client counts grouped by programId
  const clientCounts = await sql`
    SELECT "programId", COUNT(*) AS count
    FROM "Client"
    WHERE "clinic" = ${clinicId}
    GROUP BY "programId"
  `;

  // Convert clientCounts to a map for quick lookup
  const countMap = new Map(clientCounts.map(row => [row.programId, Number(row.count)]));

  // Add clientCount to each program
  const result = programs.map(program => ({
    ...program,
    clientCount: countMap.get(program.id) || 0,
  }));

  return result;
}

/**
 * Get all programs (admin view) with client counts and template info
 */
async function getAllProgramsAdmin() {
const programs = await sql`
  SELECT 
    p.*,
    row_to_json(t) AS template
  FROM "Program" p
  LEFT JOIN "Template" t ON p."tempId" = t."id"
`;

  const clientCounts = await sql`
    SELECT "programId", COUNT(*) AS count
    FROM "Client"
    GROUP BY "programId"
  `;

  const countMap = new Map(clientCounts.map(row => [row.programId, Number(row.count)]));

  const result = programs.map(program => ({
    ...program,
    clientCount: countMap.get(program.id) || 0,
  }));

  return result;
}

/**
 * Create a new program
 */
async function createProgram(name, type, duration, checkInFrequency, description, tempId, clinicId) {
  const [program] = await sql`
    INSERT INTO "Program" ("name", "type", "duration", "checkInFrequency", "description", "tempId", "clinicId")
    VALUES (${name}, ${type}, ${duration}, ${checkInFrequency}, ${description}, ${tempId}, ${clinicId})
    RETURNING *
  `;
  return program;
}

/**
 * Get all templates
 */
async function getTemplates() {
  return await sql`SELECT * FROM "Template"`;
}

/**
 * Get template by ID
 */
async function getTemplateDescription(id) {
  const template = await sql`SELECT * FROM "Template" WHERE "id" = ${id} LIMIT 1`;
  return template[0] || null;
}

/**
 * Create a new template
 */
async function createTemplate(type, description) {
  const [template] = await sql`
    INSERT INTO "Template" ("type", "description")
    VALUES (${type}, ${description})
    RETURNING *
  `;
  return template;
}

/**
 * Update a template by ID (upsert behavior)
 */
async function updateTemplate(id, description, type) {
  // PostgreSQL UPSERT using ON CONFLICT requires a unique constraint on id
  const [updated] = await sql`
    INSERT INTO "Template" ("id", "description", "type")
    VALUES (${id}, ${description}, ${type})
    ON CONFLICT ("id") DO UPDATE SET
      "description" = EXCLUDED."description",
      "type" = EXCLUDED."type"
    RETURNING *
  `;
  return updated;
}

/**
 * Delete a template by ID
 */
async function deleteTemplate(id) {
  const [deleted] = await sql`
    DELETE FROM "Template" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

export const programRepo = {
  getTemplates,
  getPrograms,
  createProgram,
  createTemplate,
  updateTemplate,
  getTemplateDescription,
  deleteTemplate,
  getAllProgramsAdmin,
};
