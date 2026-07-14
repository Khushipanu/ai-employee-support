// Server-only notification data access, backed by MongoDB Atlas.
// Used by the /api/notifications route handlers (Node runtime, not Edge).
import { getDb } from "@/lib/mongodb";
import { getAllUsers } from "@/data/users";

const COLLECTION = "notifications";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function getNotificationsByEmail(email) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ recipientEmail: email })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  return docs.map(serialize);
}

export async function createNotification({ recipientEmail, type, title, message, link }) {
  const db = await getDb();
  const notification = {
    id: `N-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientEmail,
    type,
    title,
    message,
    link: link || null,
    read: false,
    createdAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(notification);
  return serialize(notification);
}

// Broadcasts one notification per non-Admin user — Admin has no personal
// dashboard/notification surface (see lib/roles.js).
export async function notifyAllEmployees({ type, title, message, link }) {
  const db = await getDb();
  const users = await getAllUsers();
  const recipients = users.filter((u) => u.role !== "Admin");
  if (recipients.length === 0) return [];

  const createdAt = new Date().toISOString();
  const notifications = recipients.map((u, i) => ({
    id: `N-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
    recipientEmail: u.email,
    type,
    title,
    message,
    link: link || null,
    read: false,
    createdAt,
  }));

  await db.collection(COLLECTION).insertMany(notifications);
  return notifications.map(serialize);
}

export async function markNotificationRead(id) {
  const db = await getDb();
  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate({ id }, { $set: { read: true } }, { returnDocument: "after" });
  return serialize(result);
}

export async function markAllNotificationsRead(email) {
  const db = await getDb();
  await db.collection(COLLECTION).updateMany(
    { recipientEmail: email, read: false },
    { $set: { read: true } }
  );
}
