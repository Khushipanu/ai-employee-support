import { getAIAnswer } from "@/lib/ai";

export async function POST(request) {
  const body = await request.json();
  const question = (body?.question || "").trim();

  if (!question) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  const result = await getAIAnswer(question);
  return Response.json(result);
}
