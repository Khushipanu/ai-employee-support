// Server-only internal job posting data access, backed by MongoDB Atlas.
// Used by the /api/jobs route handlers (Node runtime, not Edge).
import { getDb } from "@/lib/mongodb";

const COLLECTION = "jobs";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

function isPastDeadline(job) {
  return Boolean(job.deadline) && new Date(job.deadline) < new Date();
}

export async function getAllJobs() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serialize);
}

// Open = not past its application deadline, for the employee-facing list.
export async function getOpenJobs() {
  const all = await getAllJobs();
  return all.filter((j) => !isPastDeadline(j));
}

export async function getJobById(id) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  return serialize(doc);
}

export async function createJob({
  title,
  department,
  eligibility,
  experience,
  deadline,
  description,
  createdByName,
  createdByEmail,
}) {
  const db = await getDb();
  const newJob = {
    id: `J-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    department,
    eligibility,
    experience,
    deadline: deadline || null,
    description,
    createdByName,
    createdByEmail,
    createdAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(newJob);
  return serialize(newJob);
}

export async function deleteJob(id) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ id });
  if (!doc) return null;
  await db.collection(COLLECTION).deleteOne({ id });
  return serialize(doc);
}
