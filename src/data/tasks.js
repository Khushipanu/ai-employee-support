// Server-only personal task/to-do data access, backed by MongoDB Atlas.
// Used by the /api/tasks route handlers (Node runtime, not Edge). Tasks are
// scoped per employee per calendar date — a fresh list each day.
import { getDb } from "@/lib/mongodb";

const COLLECTION = "tasks";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function getTasksFor(employeeEmail, date) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ employeeEmail, date })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map(serialize);
}

export async function createTask({ employeeEmail, text, date }) {
  const db = await getDb();
  const newTask = {
    id: `TSK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    employeeEmail,
    text,
    date,
    done: false,
    createdAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(newTask);
  return serialize(newTask);
}

export async function updateTask(id, { text, done }) {
  const db = await getDb();
  const update = {};
  if (typeof text === "string") update.text = text;
  if (typeof done === "boolean") update.done = done;

  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate({ id }, { $set: update }, { returnDocument: "after" });
  return serialize(result);
}

export async function deleteTask(id) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  if (!doc) return null;
  await db.collection(COLLECTION).deleteOne({ id });
  return serialize(doc);
}
