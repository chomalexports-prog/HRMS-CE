import type { Request, Response } from "express";
import { getSMTPTransporter, getEtherealTransporter, generateEmailHtml } from "../utils/email";
import nodemailer from "nodemailer";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email address is required." });
  }

  const adminEmail = process.env.HR_ADMIN_EMAIL || "chomalexports@gmail.com";
  const requestTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const subject = `[HRMS-CE] Password Reset Request — ${email}`;
  const body = `A password reset has been requested for the following employee account:\n\nEmployee Email: ${email}\nRequest Time: ${requestTime} IST\n\nPlease log in to the HRMS-CE admin panel, locate the employee, and share their new credentials with them securely.\n\nThis request was submitted via the HRMS-CE login portal.`;

  const htmlBody = `
    <p style="font-size:14px;color:#1e293b;">A <strong>password reset request</strong> has been submitted for the following employee account:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
      <tr style="background:#f1f5f9;">
        <td style="padding:10px 14px;font-weight:bold;color:#475569;border:1px solid #e2e8f0;width:40%;">Employee Email</td>
        <td style="padding:10px 14px;color:#0f172a;border:1px solid #e2e8f0;font-family:monospace;">${email}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;font-weight:bold;color:#475569;border:1px solid #e2e8f0;">Request Time</td>
        <td style="padding:10px 14px;color:#0f172a;border:1px solid #e2e8f0;">${requestTime} IST</td>
      </tr>
    </table>
    <p style="font-size:13px;color:#475569;">Please log in to the HRMS-CE admin panel, locate the employee record, and securely share their updated credentials.</p>
  `;

  // Try real SMTP first
  const transporter = getSMTPTransporter();
  if (transporter) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || "no-reply@hrms-ce.local";
    const fromName = process.env.SMTP_FROM_NAME || "HRMS-CE";
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: adminEmail,
        subject,
        html: generateEmailHtml("General", "HR Admin", subject, htmlBody),
      });
      console.log(`[Forgot Password] Notification sent to admin: ${adminEmail}`);
      return res.json({ success: true, mode: "smtp", message: "Reset request emailed to HR Admin." });
    } catch (err: any) {
      console.error("Forgot Password SMTP Failed:", err);
    }
  }

  // Fall back to Ethereal
  try {
    const freeTransporter = await getEtherealTransporter();
    if (freeTransporter) {
      const info = await freeTransporter.sendMail({
        from: '"HRMS-CE" <no-reply@hrms-ce.local>',
        to: adminEmail,
        subject,
        html: generateEmailHtml("General", "HR Admin", subject, htmlBody),
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Forgot Password Ethereal] Preview: ${previewUrl}`);
      return res.json({ success: true, mode: "ethereal", message: "Reset request submitted.", previewUrl });
    }
  } catch (err: any) {
    console.error("Forgot Password Ethereal Failed:", err);
  }

  // Simulated fallback
  console.log(`[Forgot Password Simulated] Request for ${email} → admin ${adminEmail}`);
  return res.json({ success: true, mode: "simulated", message: "Request logged. Configure SMTP to enable real email delivery." });
}
