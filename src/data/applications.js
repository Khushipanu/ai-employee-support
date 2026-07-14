// Server-only job application data access, backed by MongoDB Atlas.
// Used by the /api/applications route handlers (Node runtime, not Edge).
import { getDb } from "@/lib/mongodb";

const COLLECTION = "applications";

function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function getAllApplications() {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ appliedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getApplicationsByJob(jobId) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ jobId })
    .sort({ appliedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getApplicationsByEmployee(applicantEmail) {
  const db = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({ applicantEmail })
    .sort({ appliedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function findApplication(jobId, applicantEmail) {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ jobId, applicantEmail });
  return serialize(doc);
}

export async function createApplication({
  jobId,
  jobTitle,
  applicantName,
  applicantEmail,
  resume,
}) {
  const db = await getDb();
  const newApplication = {
    id: `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    jobId,
    jobTitle,
    applicantName,
    applicantEmail,
    resume,
    status: "Applied",
    appliedAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(newApplication);
  return serialize(newApplication);
}

export async function updateApplicationStatus(id, status) {
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
