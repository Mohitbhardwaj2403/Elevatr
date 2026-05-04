import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateCareerAnswer(userMessage: string): Promise<string | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt =
      "You are an AI career assistant specialized in resumes, ATS optimization, interview preparation, job search strategies, and career growth. Answer concisely with practical, actionable advice. Avoid hallucinations; if unsure, ask a clarifying question.";

    const prompt = `${systemPrompt}\n\nUser: ${userMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text?.trim() || null;
  } catch (error) {
    console.error("Gemini generateCareerAnswer error", error);
    return null;
  }
}


