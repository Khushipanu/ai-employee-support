import {
  getAllAnnouncements,
  getActiveAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "@/data/announcements";
import { notifyAllEmployees } from "@/data/notifications";
import { savePdf } from "@/lib/uploads";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  const announcements = all ? await getAllAnnouncements() : await getActiveAnnouncements();
  return Response.json({ announcements });
}

export async function POST(request) {
  const form = await request.formData();
  const title = form.get("title");
  const description = form.get("description");
  const priority = form.get("priority");
  const expiryDate = form.get("expiryDate");
  const createdByName = form.get("createdByName");
  const createdByEmail = form.get("createdByEmail");
  const file = form.get("attachment");

  if (!title || !description || !createdByName || !createdByEmail) {
    return Response.json(
      { error: "title, description, createdByName, and createdByEmail are required" },
      { status: 400 }
    );
  }

  let attachment = null;
  if (file && typeof file === "object" && file.size > 0) {
    try {
      attachment = await savePdf(file, "announcements");
    } catch (err) {
      return Response.json({ error: err.message }, { status: 400 });
    }
  }

  const announcement = await createAnnouncement({
    title,
    description,
    priority,
    attachment,
    expiryDate: expiryDate || null,
    createdByName,
    createdByEmail,
  });

  await notifyAllEmployees({
    type: "announcement",
    title: "New announcement",
    message: announcement.title,
    link: "/dashboard",
  });

  return Response.json({ announcement }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const announcement = await deleteAnnouncement(id);
  if (!announcement) {
    return Response.json({ error: "Announcement not found" }, { status: 404 });
  }
  return Response.json({ announcement });
}
