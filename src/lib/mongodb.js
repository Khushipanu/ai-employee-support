// MongoDB Atlas connection helper (Node runtime only — used from route handlers).
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ai_employee_support";

let clientPromise;

if (!uri) {
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not set in .env.local")
  );
} else if (process.env.NODE_ENV === "development") {
  // Reuse the client across HMR reloads in dev so we don't open a new
  // connection pool on every file save.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}
