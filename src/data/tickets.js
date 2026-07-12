// Server-only ticket data access, backed by MongoDB Atlas.
// Used by the /api/ticket route handlers (Node runtime, not Edge).
import { getDb } from "@/lib/mongodb";

const COLLECTION = "tickets";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function getAllTickets() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getTicketsByEmployee(employeeEmail) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ employeeEmail })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getTicketsByCategory(category) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ category })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function createTicket(ticket) {
  const db = await getDb();
  const newTicket = {
    id: `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "Open",
    createdAt: new Date().toISOString(),
    ...ticket,
  };
  await db.collection(COLLECTION).insertOne(newTicket);
  return serialize(newTicket);
}

export async function updateTicketStatus(id, status) {
  const db = await getDb();
  const updatedAt = new Date().toISOString();
  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate(
      { id },
      { $set: { status, updatedAt } },
      { returnDocument: "after" }
    );
  return serialize(result);
}
