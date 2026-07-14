// Where each role lands after login / when it hits a page it can't access.
// Admin, HR, and IT are scoped to their own management console only — no
// personal AI-chat/dashboard/ticket-raising surface, unlike Employee.
export function homeForRole(role) {
  if (role === "Admin") return "/admin";
  if (role === "HR") return "/hr";
  if (role === "IT") return "/it";
  return "/dashboard";
}
