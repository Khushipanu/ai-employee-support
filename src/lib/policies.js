// Company policy knowledge base (Zeera Pvt. Ltd.). This is passed to the AI
// as context so it only answers from real policy text, and is also used as
// a keyword-match fallback when no AI API key is configured.
export const policies = [
  {
    id: "company-overview",
    category: "General",
    title: "Company Overview",
    keywords: [
      "company name", "head office", "branch office", "working days",
      "weekly off", "office timing", "office hours", "lunch break",
      "hr email", "it support email", "reception", "front desk", "contact",
      "founded", "address",
    ],
    content:
      "Zeera Pvt. Ltd. was founded in 2011. Head Office: Plot 42, Industrial Area Phase 2, " +
      "Rudrapur, Uttarakhand, 263153. Branch Office: Delhi (Sales). Working days are Monday to " +
      "Saturday, with Saturday and Sunday as the weekly off. Office timings are 10 AM to 7 PM, " +
      "with a 1-hour lunch break from 1:00-2:00 PM. HR Email: hr@zeera.com. IT Support Email: " +
      "itsupport@zeera.com. Reception/Front Desk: 05946-221340.",
  },
  {
    id: "leave-policy",
    category: "HR",
    title: "Leave Policy",
    keywords: [
      "leave", "casual leave", "cl", "sick leave", "sl", "earned leave", "el",
      "maternity", "paternity", "bereavement", "leave without pay", "apply leave",
      "vacation", "time off", "pto",
    ],
    content:
      "Casual Leave (CL): 12 days per year, credited monthly (1/month). Sick Leave (SL): 8 days " +
      "per year; a medical certificate is required if more than 2 consecutive days are taken. " +
      "Earned Leave (EL): 15 days per year, accrued monthly, max carry-forward of 30 days, and " +
      "encashable at year-end. Maternity Leave: 26 weeks paid. Paternity Leave: 10 working days. " +
      "Bereavement Leave: 3 days for immediate family. Leave without pay is allowed only after all " +
      "leave balance is exhausted, and needs Client Admin approval. To apply: ERP Portal > Leave " +
      "Module > Apply Leave, with a minimum 2 days advance notice (except sick leave, which allows " +
      "same-day application with intimation to manager). Approval authority is the Direct Reporting " +
      "Manager; if not approved within 3 working days, it auto-escalates to the Department Head.",
  },
  {
    id: "attendance-policy",
    category: "HR",
    title: "Attendance Policy",
    keywords: [
      "attendance", "biometric", "check-in", "check-out", "late", "grace period",
      "half day", "absent", "absence", "work from home", "wfh", "remote",
    ],
    content:
      "Biometric check-in/check-out is mandatory at the factory; ERP portal check-in applies for " +
      "office staff. Late grace period is 15 minutes, allowed twice per month — the 3rd instance " +
      "onward is marked as half-day. 3 unmarked/unexplained absences in a rolling 30 days triggers " +
      "an HR review. Work From Home is only for office staff (not factory floor), needs prior " +
      "approval from the manager, and is capped at 4 days/month. A half day is counted if working " +
      "hours are less than 4.5 hours.",
  },
  {
    id: "reimbursement-policy",
    category: "HR",
    title: "Reimbursement Policy",
    keywords: [
      "reimbursement", "travel", "mobile reimbursement", "internet reimbursement",
      "conveyance", "entertainment", "expense", "bill", "receipts",
    ],
    content:
      "Travel Reimbursement: submit bills on the ERP within 15 days of travel; approved by the " +
      "Department Head, paid with the next payroll cycle. Mobile/Internet Reimbursement: Rs. 800/month " +
      "for Sales & Field roles, Rs. 500/month for Department Heads and above. Local Conveyance: Rs. 150/day " +
      "cap for client visits, receipts not mandatory below Rs. 200. Client Entertainment: pre-approval " +
      "required above Rs. 2,000. If a bill is submitted after 30 days, it is auto-rejected unless HR " +
      "grants an exception.",
  },
  {
    id: "it-asset-policy",
    category: "IT",
    title: "IT & Asset Policy",
    keywords: [
      "laptop", "desktop", "asset", "vpn", "password", "software", "install",
      "lost device", "stolen device", "hardware", "it ticket", "network access",
    ],
    content:
      "Laptop/Desktop is issued against a signed Asset Acknowledgment Form. Standard laptop refresh " +
      "cycle is every 4 years. Assets must be returned within 5 working days of resignation or " +
      "termination. A lost/stolen device must be reported to IT within 24 hours; the employee bears " +
      "50% of the replacement cost if negligence is proven. Software installation is allowed only via " +
      "the IT-approved list — unauthorized software installation is a policy violation. VPN access is " +
      "mandatory for remote work; request it via an IT ticket. Password policy: minimum 10 characters, " +
      "changed every 90 days.",
  },
  {
    id: "code-of-conduct",
    category: "HR",
    title: "Code of Conduct",
    keywords: [
      "dress code", "harassment", "posh", "confidentiality", "nda", "conflict of interest",
      "social media", "conduct", "discrimination", "ethics",
    ],
    content:
      "Dress Code: smart casuals Monday-Friday, formals on client-facing days and Saturdays. " +
      "Anti-Harassment Policy: zero tolerance; POSH Committee contact is posh@zenithbiscuits.com. " +
      "Confidentiality: all client/production data is confidential, and the NDA continues for 2 " +
      "years post-employment. Conflict of Interest must be declared to HR within 7 days of " +
      "occurrence. Social Media Policy: no confidential company/client information may be shared " +
      "publicly.",
  },
  {
    id: "payroll-compensation",
    category: "HR",
    title: "Payroll & Compensation",
    keywords: [
      "salary", "payroll", "payslip", "form 16", "salary revision", "appraisal",
      "bonus", "diwali bonus", "pf", "provident fund", "gratuity", "pay day",
    ],
    content:
      "Salary is credited on the 1st working day of every month, for the previous month worked. " +
      "Payslips are available on ERP Portal > My Payroll > Payslips. Form 16 is issued by June every " +
      "year. Salary Revision Cycle is annual, effective April, based on the appraisal cycle (Jan-Mar). " +
      "Diwali bonus is equivalent to 8.33% of annual basic (statutory bonus), paid before Diwali. PF " +
      "Contribution is 12% employee + 12% employer, deducted monthly. Gratuity is applicable after 5 " +
      "years of continuous service, as per the Payment of Gratuity Act.",
  },
  {
    id: "holidays-list",
    category: "General",
    title: "Holidays List (2026)",
    keywords: ["holiday", "holidays list", "public holiday", "diwali", "holi"],
    content:
      "Company holidays for 2026: Jan 1 New Year, Jan 26 Republic Day, Mar 6 Holi, Apr 14 Ambedkar " +
      "Jayanti, May 1 Labour Day, Aug 15 Independence Day, Aug 26 Janmashtami, Oct 2 Gandhi Jayanti, " +
      "Oct 20 Diwali, Dec 25 Christmas.",
  },
  {
    id: "escalation-grievance",
    category: "HR",
    title: "Escalation / Grievance Process",
    keywords: [
      "grievance", "escalation", "escalate", "complaint", "harassment complaint",
      "anonymous", "dispute",
    ],
    content:
      "Step 1: raise the issue with your direct Reporting Manager. Step 2: if unresolved after 3 " +
      "working days, escalate to the Department Head via the ERP Grievance Module. Step 3: if " +
      "unresolved after 5 more working days, escalate to Client Admin / Leadership. Anonymous " +
      "grievances can be raised via grievance@zenithbiscuits.com and are reviewed weekly by HR. " +
      "Harassment complaints bypass all steps and go directly to the POSH Committee at " +
      "posh@zenithbiscuits.com.",
  },
  {
    id: "onboarding",
    category: "HR",
    title: "Onboarding",
    keywords: [
      "onboarding", "new joiner", "day 1", "induction", "probation", "buddy",
      "id card", "documents required",
    ],
    content:
      "Day 1: ID card, email ID creation, laptop/asset handover, and policy acknowledgment signing. " +
      "Week 1: department induction, ERP training, and a buddy is assigned. Documents required: " +
      "Aadhaar, PAN, last 3 months payslips, relieving letter, and educational certificates. " +
      "Probation Period is 6 months for all confirmed roles, and 3 months for factory floor staff.",
  },
  {
    id: "offboarding-resignation",
    category: "HR",
    title: "Offboarding / Resignation",
    keywords: [
      "resign", "resignation", "notice period", "quit", "exit", "full and final",
      "f&f", "settlement", "relieving", "experience letter", "buyout",
    ],
    content:
      "Notice Period is 60 days for confirmed employees, and 15 days during probation. Notice Period " +
      "Buyout is allowed with Client Admin approval, deducted from the full & final settlement. Full & " +
      "Final Settlement is processed within 45 days of the last working day. An Exit Interview is " +
      "mandatory, conducted by HR. The Experience Letter is issued within 7 days of the F&F " +
      "settlement.",
  },
];

export function findPolicyMatches(question) {
  const q = question.toLowerCase();
  return policies.filter((p) => p.keywords.some((k) => q.includes(k)));
}

export function policiesAsContext() {
  return policies
    .map((p) => `[${p.category}] ${p.title}: ${p.content}`)
    .join("\n\n");
}
