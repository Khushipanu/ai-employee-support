import {
  getAllTickets,
  getTicketsByEmployee,
  getTicketsByCategory,
  createTicket,
  updateTicketStatus,
  addTicketReply,
  deleteTicketForScope,
  getTicketById,
} from "@/data/tickets";
import { classifyTicket } from "@/lib/ticketClassifier";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const employeeEmail = searchParams.get("employeeEmail");
  const category = searchParams.get("category");

  let tickets;
  if (employeeEmail) {
    tickets = await getTicketsByEmployee(employeeEmail);
  } else if (category) {
    tickets = await getTicketsByCategory(category);
  } else {
    tickets = await getAllTickets();
  }

  return Response.json({ tickets });
}

export async function POST(request) {
  const body = await request.json();
  const { question, employeeName, employeeEmail } = body || {};

  if (!question || !employeeEmail) {
    return Response.json(
      { error: "question and employeeEmail are required" },
      { status: 400 }
    );
  }

  const { category, priority } = classifyTicket(question);

  const ticket = await createTicket({
    subject: question,
    category,
    priority,
    employeeName,
    employeeEmail,
  });

  return Response.json({ ticket }, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  const { id, status, reply } = body || {};

  if (!id || (!status && !reply)) {
    return Response.json(
      { error: "id and (status or reply) are required" },
      { status: 400 }
    );
  }

  const ticket = reply
    ? await addTicketReply(id, reply, status)
    : await updateTicketStatus(id, status);

  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  return Response.json({ ticket });
}

// Deletion is per-viewer: `scope` identifies which side is deleting
// (`employee:<email>` for the ticket's creator, `role:HR`/`role:IT` for the
// team that received it). It only hides the ticket from that scope's own
// dashboard — the other side keeps seeing it until they delete it too.
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const scope = searchParams.get("scope");
  if (!id || !scope) {
    return Response.json({ error: "id and scope are required" }, { status: 400 });
  }

  const existing = await getTicketById(id);
  if (!existing) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const allowedScopes = [`employee:${existing.employeeEmail}`, `role:${existing.category}`];
  if (!allowedScopes.includes(scope)) {
    return Response.json({ error: "Not allowed to delete this ticket" }, { status: 403 });
  }

  const ticket = await deleteTicketForScope(id, scope);
  return Response.json({ ticket });
}
