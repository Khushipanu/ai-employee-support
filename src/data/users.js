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
