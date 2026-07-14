import { getAllUsers, createUser, updateUser } from "@/data/users";

function strip(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

export async function GET() {
  const users = await getAllUsers();
  return Response.json({ users: users.map(strip) });
}

export async function POST(request) {
  const body = await request.json();
  const { name, email, password, role, department, joiningDate } = body || {};

  if (!name || !email || !password || !role || !department) {
    return Response.json(
      { error: "name, email, password, role, and department are required" },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({ name, email, password, role, department, joiningDate: joiningDate || null });
    return Response.json({ user: strip(user) }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 409 });
  }
}

// Self-service profile updates — name, department, and/or password only.
// Role and email are not editable here.
export async function PATCH(request) {
  const body = await request.json();
  const { email, name, department, password } = body || {};

  if (!email) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }

  try {
    const user = await updateUser(email, { name, department, password });
    return Response.json({ user: strip(user) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
