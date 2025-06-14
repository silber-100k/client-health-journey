import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function createAIReview(email, aiReview) {
    const [AIReview] = await sql`
      INSERT INTO "AIReview" ("email", "content")
      VALUES (${email}, ${aiReview})
      RETURNING *
    `;
    return AIReview;
  }

async function getReviewbyClientEmail(email) {
  const Review = await sql`
  SELECT * FROM "AIReview"
  WHERE "email" = ${email}
`;

  return Review;
}

export const AIReviewRepo = {
    createAIReview,
    getReviewbyClientEmail
  };