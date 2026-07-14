// Where each role lands after login / when it hits a page it can't access.
// Admin is scoped to tickets + employee management only — no personal
// AI-chat/dashboard/ticket-history surface, unlike Employee/HR/IT.
export function homeForRole(role) {
  if (role === "Admin") return "/admin";
  return "/dashboard";
}
