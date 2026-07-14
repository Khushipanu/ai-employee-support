// Saves user-uploaded PDFs (announcement attachments, resumes) to disk under
// public/uploads/<folder>/, and returns metadata to store on the Mongo doc.
// Local-disk storage only — fine for local/dev use, but won't persist on
// serverless hosts with an ephemeral filesystem (e.g. Vercel).
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function savePdf(file, folder) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("A file is required.");
  }
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File must be smaller than 5MB.");
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const uniqueName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, uniqueName), buffer);

  return {
    name: file.name,
    url: `/uploads/${folder}/${uniqueName}`,
    size: file.size,
  };
}
