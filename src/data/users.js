// Server-only user data access, backed by MongoDB Atlas (collection: "users").
// Seed demo accounts with `npm run seed`.
import { getDb } from "@/lib/mongodb";

const COLLECTION = "users";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function getAllUsers() {
  const db = await getDb();
  const docs = await db.collection(COLLECTION).find({}).toArray();
  return docs.map(serialize);
}

export async function findUserByCredentials(email, password) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({
    email: String(email).toLowerCase(),
    password,
  });
  return serialize(doc);
}

export async function findUserByEmail(email) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({
    email: String(email).toLowerCase(),
  });
  return serialize(doc);
}

export async function createUser({ name, email, password, role, department }) {
  const db = await getDb();
  const normalizedEmail = String(email).toLowerCase();

  const existing = await db.collection(COLLECTION).findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const newUser = {
    id: `u-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    email: normalizedEmail,
    password,
    role,
    department,
  };

  await db.collection(COLLECTION).insertOne(newUser);
  return serialize(newUser);
}
