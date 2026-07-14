// AI Chat Assistant logic: answers company policy questions using Groq
// (Llama), grounded strictly in lib/policies.js. Falls back to local
// keyword matching if no GROQ_API_KEY is configured or the call fails.
import { findPolicyMatches, policiesAsContext } from "@/lib/policies";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are an internal AI Employee Support Assistant for a company.

Rules:
- If the employee sends a greeting or small talk (e.g. "hi", "hello", "hey", "thanks", "who are you", "what can you help with"), reply warmly and briefly as yourself — introduce what you can help with (company HR & IT policy questions) — with canAnswer true. Do not require policy content for this.
- For actual questions, answer ONLY using the COMPANY POLICIES provided below.
- If the policies contain the answer, reply with a clear, concise, helpful answer based only on that content.
- If the policies do NOT contain enough information to answer a real question, you must say you cannot answer — even if you could suggest contacting HR/IT yourself. Do not deflect with a contact email instead of answering; let the app's ticket flow handle escalation.
- Never make up information that isn't in the policies.
- Always respond with strict JSON, no markdown, in this exact shape:
{"canAnswer": true or false, "answer": "your answer text or empty string if canAnswer is false", "category": "HR" or "IT" or "General"}

COMPANY POLICIES:
${policiesAsContext()}`;

const GREETING_PATTERNS = [
  /^\s*(hi|hii+|hey|hello|yo|sup)\s*[!.?]*\s*$/i,
  /^\s*(good\s?(morning|afternoon|evening))\s*[!.?]*\s*$/i,
  /^\s*(thanks|thank you|thx|ty)\s*[!.?]*\s*$/i,
  /^\s*(who are you|what can you do|what can you help with|help)\s*[!.?]*\s*$/i,
];

function isGreeting(question) {
  return GREETING_PATTERNS.some((re) => re.test(question));
}

const URGENT_ACCESS_PATTERNS = [
  /can'?t\s*log\s*?in/i, /cannot\s*log\s*?in/i, /unable to log\s*?in/i,
  /not able to log\s*?in/i, /login (is )?not working/i,
  /logging (in )?(is )?not working/i, /trouble logging in/i, /locked out/i,
  /account (is )?locked/i, /can'?t access/i, /cannot access/i,
  /unable to access/i, /password (is )?not working/i, /vpn (is )?not working/i,
  /system (is )?down/i,
];

function isUrgentAccessIssue(question) {
  return URGENT_ACCESS_PATTERNS.some((re) => re.test(question));
}

function autoTicketResponse() {
  return {
    canAnswer: false,
    answer: "",
    category: "IT",
    source: "auto",
    autoTicket: true,
  };
}

function localFallback(question) {
  if (isGreeting(question)) {
    return {
      canAnswer: true,
      answer:
        "Hi! I'm your AI Employee Support Assistant. Ask me anything about company HR or IT " +
        "policies — leave, payroll, attendance, reimbursements, IT assets, VPN, and more.",
      category: "General",
      source: "local",
    };
  }

  const matches = findPolicyMatches(question);
  if (matches.length === 0) {
    return { canAnswer: false, answer: "", category: "General", source: "local" };
  }
  const answer = matches.map((m) => m.content).join("\n\n");
  const category = matches[0].category;
  return { canAnswer: true, answer, category, source: "local" };
}

export async function getAIAnswer(question) {
  // Urgent access issues (locked out, can't log in, VPN/system down) skip
  // both the policy lookup and the AI call entirely — these need a human
  // from IT, not a policy answer, so we raise the ticket immediately.
  if (isUrgentAccessIssue(question)) {
    return autoTicketResponse();
  }

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    return localFallback(question);
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", res.status, errText);
      return localFallback(question);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return localFallback(question);

    const parsed = JSON.parse(raw);
    return {
      canAnswer: Boolean(parsed.canAnswer),
      answer: parsed.answer || "",
      category: parsed.category || "General",
      source: "groq",
    };
  } catch (err) {
    console.error("Groq call failed, falling back to local policies:", err.message);
    return localFallback(question);
  }
}
