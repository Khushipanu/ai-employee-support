// Classifies an unanswered question into a ticket category (HR/IT) and
// assigns a priority, so support tickets are routed automatically.
const IT_KEYWORDS = [
  "password", "laptop", "wifi", "vpn", "network", "software", "install",
  "printer", "email", "outlook", "login", "access", "account locked",
  "hardware", "monitor", "system", "server", "internet", "license",
  "asset acknowledgment", "lost device", "stolen device", "it ticket",
];

const HR_KEYWORDS = [
  "leave", "salary", "payroll", "resign", "notice period", "harassment",
  "benefits", "insurance", "bonus", "appraisal", "promotion", "hr",
  "onboarding", "offboarding", "vacation", "sick", "conduct", "grievance",
  "casual leave", "earned leave", "maternity", "paternity", "bereavement",
  "reimbursement", "travel", "conveyance", "entertainment expense",
  "biometric", "attendance", "half day", "work from home", "wfh",
  "probation", "dress code", "posh", "confidentiality", "nda",
  "gratuity", "provident fund", "form 16", "settlement", "relieving",
  "experience letter", "exit interview", "holiday",
];

const HIGH_PRIORITY_KEYWORDS = [
  "urgent", "asap", "immediately", "not working", "locked out", "cannot access",
  "harassment", "security", "breach", "down", "blocked", "critical",
  "unable to login", "unable to log in", "can't login", "can't log in",
  "cannot login", "cannot log in", "account locked", "since morning",
];

export function classifyCategory(text) {
  const t = text.toLowerCase();
  const itScore = IT_KEYWORDS.filter((k) => t.includes(k)).length;
  const hrScore = HR_KEYWORDS.filter((k) => t.includes(k)).length;

  if (itScore === 0 && hrScore === 0) return "IT";
  return itScore >= hrScore ? "IT" : "HR";
}

export function classifyPriority(text) {
  const t = text.toLowerCase();
  const isHigh = HIGH_PRIORITY_KEYWORDS.some((k) => t.includes(k));
  return isHigh ? "High" : "Medium";
}

export function classifyTicket(text) {
  return {
    category: classifyCategory(text),
    priority: classifyPriority(text),
  };
}
