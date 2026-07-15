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
    .find({ employeeEmail, deletedFor: { $ne: `employee:${employeeEmail}` } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getTicketsByCategory(category) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ category, deletedFor: { $ne: `role:${category}` } })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getTicketById(id) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  return serialize(doc);
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

// Deletion is per-viewer, not global: the employee who raised a ticket and
// the HR/IT team that received it each have their own "deletedFor" scope
// (`employee:<email>` / `role:<category>`). Deleting only hides the ticket
// from the scope that deleted it — the other side keeps seeing it — so the
// document is only actually removed once every scope that can see it has
// deleted its side.
export async function deleteTicketForScope(id, scope) {
  const db = await getDb();
  const collection = db.collection(COLLECTION);

  const updated = await collection.findOneAndUpdate(
    { id },
    { $addToSet: { deletedFor: scope } },
    { returnDocument: "after" }
  );
  if (!updated) return null;

  const requiredScopes = [`employee:${updated.employeeEmail}`, `role:${updated.category}`];
  const deletedFor = updated.deletedFor || [];
  const fullyDeleted = requiredScopes.every((s) => deletedFor.includes(s));

  if (fullyDeleted) {
    await collection.deleteOne({ id });
  }

  return serialize(updated);
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

// Appends a reply to the ticket's conversation thread, optionally moving its
// status in the same update (e.g. resolving with a note in one action).
export async function addTicketReply(id, { authorName, authorRole, text }, status) {
  const db = await getDb();
  const updatedAt = new Date().toISOString();
  const reply = {
    id: `R-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    authorName,
    authorRole,
    text,
    createdAt: updatedAt,
  };

  const update = { $push: { replies: reply }, $set: { updatedAt } };
  if (status) update.$set.status = status;

  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate({ id }, update, { returnDocument: "after" });
  return serialize(result);
}
