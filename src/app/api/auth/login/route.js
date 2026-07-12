import { findUserByCredentials } from "@/data/users";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await findUserByCredentials(email, password);
  if (!user) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const { password: _pw, ...safeUser } = user;
  return Response.json({ user: safeUser });
}
