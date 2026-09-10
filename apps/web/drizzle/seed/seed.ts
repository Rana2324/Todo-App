/**
 * drizzle/seed/seed.ts
 *
 * Database seed script — run manually with:
 *   npx tsx drizzle/seed/seed.ts
 *
 * এই file-এ development-এর জন্য initial data insert করা হয়।
 * Production-এ এই script run করা উচিত নয়।
 *
 * TODO: প্রয়োজনে এখানে dev seed data যোগ করুন।
 * উদাহরণ: test user তৈরি করা, demo todos insert করা ইত্যাদি।
 * Example: import { db } from "../client"; তারপর db.insert(...) call করো।
 */

async function seed() {
  console.log("🌱 Seed script started...");

  // Example: insert a test todo
  // const { db } = await import("../client");
  // await db.insert(todos).values({ userId: "test-user-id", title: "Test Todo" });

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
