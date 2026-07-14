// Seeds the MongoDB Atlas "users" collection with demo accounts.
// Run with: npm run seed
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

const users = [
  {
    id: "u1",
    name: "Khushi Panu",
    email: "khushi@company.com",
    password: "demo-pw-redacted",
    role: "Admin",
    department: "Administration",
  },
  {
    id: "u2",
    name: "Aman Verma",
    email: "aman@company.com",
    password: "demo-pw-redacted",
    role: "Employee",
    department: "Sales",
  },
  {
    id: "u3",
    name: "Priya HR",
    email: "hr@company.com",
    password: "demo-pw-redacted",
    role: "HR",
    department: "Human Resources",
  },
  {
    id: "u4",
    name: "Rahul IT",
    email: "it@company.com",
    password: "demo-pw-redacted",
    role: "IT",
    department: "IT Support",
  },
  {
    id: "u5",
    name: "Employee",
    email: "employee@company.com",
    password: "REDACTED",
    role: "Employee",
    department: "Operations",
  },
];

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
