import {
  getAllApplications,
  getApplicationsByJob,
  getApplicationsByEmployee,
  findApplication,
  createApplication,
  updateApplicationStatus,
} from "@/data/applications";
import { getJobById } from "@/data/jobs";
import { createNotification } from "@/data/notifications";
import { savePdf } from "@/lib/uploads";

const STATUS_MESSAGE = {
  Shortlisted: "You've been shortlisted — the next recruitment stage will follow soon.",
  Rejected: "Your application was not selected to move forward this time.",
  Selected: "Congratulations — you've been selected for this role!",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  const applicantEmail = searchParams.get("applicantEmail");

  let applications;
  if (applicantEmail) {
    applications = await getApplicationsByEmployee(applicantEmail);
  } else if (jobId) {
    applications = await getApplicationsByJob(jobId);
  } else {
    applications = await getAllApplications();
  }

  return Response.json({ applications });
}

export async function POST(request) {
  const form = await request.formData();
  const jobId = form.get("jobId");
  const applicantName = form.get("applicantName");
  const applicantEmail = form.get("applicantEmail");
  const file = form.get("resume");

  if (!jobId || !applicantName || !applicantEmail) {
    return Response.json(
      { error: "jobId, applicantName, and applicantEmail are required" },
      { status: 400 }
    );
  }
  if (!file || typeof file !== "object" || file.size === 0) {
    return Response.json({ error: "A resume PDF is required." }, { status: 400 });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return Response.json({ error: "Job posting not found" }, { status: 404 });
  }

  const existing = await findApplication(jobId, applicantEmail);
  if (existing) {
    return Response.json(
      { error: "You've already applied to this position." },
      { status: 409 }
    );
  }

  let resume;
  try {
    resume = await savePdf(file, "resumes");
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }

  const application = await createApplication({
    jobId,
    jobTitle: job.title,
    applicantName,
    applicantEmail,
    resume,
  });

  return Response.json({ application }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const { id, status } = body || {};

  if (!id || !status) {
    return Response.json({ error: "id and status are required" }, { status: 400 });
  }

  const application = await updateApplicationStatus(id, status);
  if (!application) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  const message = STATUS_MESSAGE[status];
  if (message) {
    await createNotification({
      recipientEmail: application.applicantEmail,
      type: "application",
      title: `Update on your application — ${application.jobTitle}`,
      message,
      link: "/jobs",
    });
  }

  return Response.json({ application });
}
