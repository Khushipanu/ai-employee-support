import {
  getAllTickets,
  getTicketsByEmployee,
  getTicketsByCategory,
  createTicket,
  updateTicketStatus,
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
  const { id, status } = body || {};

  if (!id || !status) {
    return Response.json(
      { error: "id and status are required" },
      { status: 400 }
    );
  }

  const ticket = await updateTicketStatus(id, status);
  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  return Response.json({ ticket });
}
