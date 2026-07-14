import {
  getNotificationsByEmail,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/data/notifications";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  const notifications = await getNotificationsByEmail(email);
  return Response.json({ notifications });
}

export async function PATCH(request) {
  const body = await request.json();
  const { id, email, markAll } = body || {};

  if (markAll && email) {
    await markAllNotificationsRead(email);
    return Response.json({ ok: true });
  }

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const notification = await markNotificationRead(id);
  if (!notification) {
    return Response.json({ error: "Notification not found" }, { status: 404 });
  }
  return Response.json({ notification });
}
