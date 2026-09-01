import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

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

  const { message, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    let simulatedResponse = `Welcome to the HRMS-CE Assistant! I am trained on your company handbook guidelines.
    
    Here is some quick handbook information:
    - Leave Policy: Full-time employees receive 18 days of paid annual leave plus sick leave.
    - Attendance: Core work hours are 9:00 AM to 5:00 PM local time. Flexible arrival is permitted.
    - Performance: Appraisals are conducted bi-annually (H1 in June, H2 in December).
    - Payroll: Salaries are credited on the last business day of each month.
    
    (Note: This is a simulated assistance response. Configure your GEMINI_API_KEY in Vercel Environment Variables to enable live conversation with Gemini!)`;
    return res.json({ response: simulatedResponse, isSimulated: true });
  }

  try {
    const systemInstruction = `You are HRMS-CE's premium SaaS HR Assistant, a knowledgeable, friendly, and expert colleague trained on the HRMS-CE Employee Handbook.
    HRMS-CE Guidelines:
    1. Paid Leaves: 18 annual paid leaves, 10 casual leaves, maternity is 12 weeks paid.
    2. Working Hours: Flexible, core window is 10 AM to 4 PM. Total target is 40 hours/week.
    3. Asset Policy: Laptops must be returned upon exit. Company covers up to $200 for remote office setups.
    4. Payroll: Invoices/payslips are processed on the 28th of each month.
    5. Expenses: Meal expensing capped at $30/day during business travels.
    
    Respond in a professional, concise, and helpful tone. Do not mention that you have an instruction sheet; speak as an integrated system assistant.`;

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini assistant API error:", err);
    res.status(500).json({ response: "I encountered a minor issue processing that. Please try again. " + err.message });
  }
}
