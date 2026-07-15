// Seeds the MongoDB Atlas "users" collection with demo accounts.
// Run with: npm run seed
// Real accounts live in seed-data.local.mjs (gitignored) — copy seed-data.example.mjs
// to seed-data.local.mjs and fill in real values before running this.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const localDataPath = path.join(__dirname, "seed-data.local.mjs");
if (!fs.existsSync(localDataPath)) {
  console.error(
    "Missing scripts/seed-data.local.mjs — copy scripts/seed-data.example.mjs to seed-data.local.mjs and fill in real accounts."
  );
  process.exit(1);
}
const { users } = await import("./seed-data.local.mjs");

const client = new MongoClient(env.MONGODB_URI);

try {
  await client.connect();
  const db = client.db(env.MONGODB_DB || "ai_employee_support");
  const collection = db.collection("users");

  for (const user of users) {
    await collection.updateOne(
      { email: user.email },
      { $set: user },
      { upsert: true }
    );
    console.log(`Seeded ${user.email} (${user.role})`);
  }

  console.log(`Done — ${users.length} users upserted into "users" collection.`);
} finally {
  await client.close();
}
