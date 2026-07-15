import { getTasksFor, createTask, updateTask, deleteTask } from "@/data/tasks";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const employeeEmail = searchParams.get("employeeEmail");
  const date = searchParams.get("date");

  if (!employeeEmail || !date) {
    return Response.json({ error: "employeeEmail and date are required" }, { status: 400 });
  }

  const tasks = await getTasksFor(employeeEmail, date);
  return Response.json({ tasks });
}

export async function POST(request) {
  const body = await request.json();
  const { employeeEmail, text, date } = body || {};

  if (!employeeEmail || !text || !date) {
    return Response.json(
      { error: "employeeEmail, text, and date are required" },
      { status: 400 }
    );
  }

  const task = await createTask({ employeeEmail, text: text.trim(), date });
  return Response.json({ task }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const { id, text, done } = body || {};

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const task = await updateTask(id, { text, done });
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  return Response.json({ task });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const task = await deleteTask(id);
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }
  return Response.json({ task });
}
