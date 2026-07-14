// Server-only announcement data access, backed by MongoDB Atlas.
// Used by the /api/announcements route handlers (Node runtime, not Edge).
import { getDb } from "@/lib/mongodb";

const COLLECTION = "announcements";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

function isExpired(a) {
  return Boolean(a.expiryDate) && new Date(a.expiryDate) < new Date();
}

export async function getAllAnnouncements() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

// Active = not expired, for the employee-facing feed.
export async function getActiveAnnouncements() {
  const all = await getAllAnnouncements();
  return all.filter((a) => !isExpired(a));
}

export async function createAnnouncement({
  title,
  description,
  priority,
  attachment,
  expiryDate,
  createdByName,
  createdByEmail,
}) {
  const db = await getDb();
  const newAnnouncement = {
    id: `A-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    description,
    priority: priority === "Urgent" ? "Urgent" : "Normal",
    attachment: attachment || null,
    expiryDate: expiryDate || null,
    createdByName,
    createdByEmail,
    createdAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(newAnnouncement);
  return serialize(newAnnouncement);
}

export async function deleteAnnouncement(id) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  if (!doc) return null;
  await db.collection(COLLECTION).deleteOne({ id });
  return serialize(doc);
}
