import { getAllUsers, createUser } from "@/data/users";

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
  const { name, email, password, role, department } = body || {};

  if (!name || !email || !password || !role || !department) {
    return Response.json(
      { error: "name, email, password, role, and department are required" },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({ name, email, password, role, department });
    return Response.json({ user: strip(user) }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 409 });
  }
}
