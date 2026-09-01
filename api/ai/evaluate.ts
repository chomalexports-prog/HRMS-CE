import type { Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      geminiClient = new GoogleGenAI({ apiKey });
    }
  }
  return geminiClient;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { jobTitle, jobDescription, candidateName, candidateResume } = req.body;
  
  if (!jobTitle || !candidateName || !candidateResume) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const client = getGeminiClient();

  if (!client) {
    // Simulated fallback
    return res.json({
      score: Math.floor(Math.random() * 40) + 50,
      evaluation: `*Simulated Evaluation*\n- Solid baseline for ${jobTitle}\n- Lacks some required core skills\n- Candidate ${candidateName} shows strong potential but needs training.\n\n(Note: Set GEMINI_API_KEY in Vercel env vars for real AI evaluations!)`
    });
  }

  try {
    const prompt = `
      You are an expert HR Technical Recruiter. Evaluate this candidate based strictly on the job requirements.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription || 'N/A'}
      
      Candidate Name: ${candidateName}
      Candidate Resume:
      ${candidateResume}
      
      Critique their suitability, extract key strengths and weaknesses, and provide a final score from 0 to 100 based on their match.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Integer evaluation score from 0 to 100" },
            evaluation: { type: Type.STRING, description: "A concise professional bulleted/paragraphed critique of suitability" }
          },
          required: ["score", "evaluation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Gemini evaluate API error:", err);
    res.status(500).json({ error: "Gemini evaluation failed", details: err.message });
  }
}
