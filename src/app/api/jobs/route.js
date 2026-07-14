import { getAllJobs, getOpenJobs, createJob, deleteJob } from "@/data/jobs";
import { notifyAllEmployees } from "@/data/notifications";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const jobs = all ? await getAllJobs() : await getOpenJobs();
  return Response.json({ jobs });
}

export async function POST(request) {
  const body = await request.json();
  const {
    title,
    department,
    eligibility,
    experience,
    deadline,
    description,
    createdByName,
    createdByEmail,
  } = body || {};

  if (!title || !department || !eligibility || !experience || !description || !createdByEmail) {
    return Response.json(
      {
        error:
          "title, department, eligibility, experience, description, and createdByEmail are required",
      },
      { status: 400 }
    );
  }

  const job = await createJob({
    title,
    department,
    eligibility,
    experience,
    deadline: deadline || null,
    description,
    createdByName,
    createdByEmail,
  });

  await notifyAllEmployees({
    type: "job",
    title: "New job posting",
    message: `${job.title} — ${job.department}`,
    link: "/jobs",
  });

  return Response.json({ job }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const job = await deleteJob(id);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }
  return Response.json({ job });
}
