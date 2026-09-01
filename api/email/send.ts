import type { Request, Response } from "express";
import { getSMTPTransporter, getEtherealTransporter, generateEmailHtml } from "../utils/email";
import nodemailer from "nodemailer";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { campaignType, employeeName, recipientEmail, subject, body } = req.body;

  if (!recipientEmail) {
    return res.status(400).json({ success: false, message: "Recipient email is required" });
  }

  const htmlBody = generateEmailHtml(campaignType, employeeName, subject, body);

  // Try real SMTP first
  const transporter = getSMTPTransporter();
  if (transporter) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@hrms-ce.local";
    const fromName = process.env.SMTP_FROM_NAME || "HRMS-CE";
    
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: recipientEmail,
        subject,
        html: htmlBody,
      });
      console.log(`[Email Hub] Real email sent to ${recipientEmail}`);
      return res.json({ 
        success: true, 
        mode: "smtp", 
        message: `Real email successfully dispatched to ${recipientEmail}` 
      });
    } catch (err: any) {
      console.error("SMTP Failed:", err);
      // Fall through to Ethereal/simulated
    }
  }

  // Fall back to free Ethereal testing SMTP
  try {
    const freeTransporter = await getEtherealTransporter();
    if (freeTransporter) {
      const info = await freeTransporter.sendMail({
        from: '"HRMS-CE" <no-reply@hrms-ce.local>',
        to: recipientEmail,
        subject,
        html: htmlBody,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Email Hub] Ethereal test email preview: ${previewUrl}`);
      return res.json({ 
        success: true, 
        mode: "ethereal", 
        message: `Test email dispatched. Preview URL generated.`,
        previewUrl 
      });
    }
  } catch (err: any) {
    console.error("Ethereal Transporter Failed:", err);
  }

  // Final fallback: Simulated
  console.log(`[Email Hub] Simulated email to ${recipientEmail}`);
  res.json({ 
    success: true, 
    mode: "simulated", 
    message: `Simulated email dispatched to ${recipientEmail}. Setup SMTP keys in .env to send real emails.` 
  });
}
