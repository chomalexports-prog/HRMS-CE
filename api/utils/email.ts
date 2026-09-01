import nodemailer from "nodemailer";

// Lazy-initialized SMTP Transport client
let smtpTransporter: any = null;

export function getSMTPTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT || "587";

  if (!host || !user || !pass) {
    return null;
  }

  if (!smtpTransporter) {
    try {
      smtpTransporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: port === "465", // true for port 465, false for other ports (using STARTTLS)
        auth: {
          user,
          pass,
        },
      });
    } catch (e) {
      console.error("Failed to initialize SMTP Transporter:", e);
      return null;
    }
  }
  return smtpTransporter;
}

// Lazy-initialized Ethereal SMTP Transport client for free auto-testing out of the box
let etherealTransporter: any = null;

export async function getEtherealTransporter() {
  if (!etherealTransporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      etherealTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Ethereal Auto-SMTP] Provisioned free test account: ${testAccount.user}`);
    } catch (e) {
      console.error("Failed to dynamically provision free Ethereal SMTP test account:", e);
    }
  }
  return etherealTransporter;
}

// Gorgeous responsive HTML Email layout builder
export function generateEmailHtml(campaignType: string, employeeName: string, subject: string, body: string): string {
  let headerColor = "#8b5cf6"; // Purple-500
  let bannerText = "HRMS-CE Operations & Internal Communications";
  let titleText = "HR Notification";
  let accentBlock = "";

  if (campaignType === "Birthday") {
    headerColor = "#ec4899"; // Pink-500
    titleText = "Happy Birthday! 🎂";
    bannerText = "HRMS-CE Celebrates You";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; display: flex; align-items: center;">
        <div style="font-size: 24px; margin-right: 12px;">🎁</div>
        <div>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #9d174d;">Birthday Perk Activated!</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #be185d;">Enjoy a complimentary Starbucks voucher on HRMS-CE.</p>
          <span style="display: inline-block; margin-top: 6px; padding: 3px 8px; font-family: monospace; font-size: 11px; font-weight: bold; color: #9d174d; background-color: #fce7f3; border-radius: 4px; text-transform: uppercase;">Code: BDAY-2026-${employeeName.substring(0, 3).toUpperCase()}</span>
        </div>
      </div>
    `;
  } else if (campaignType === "Work Anniversary") {
    headerColor = "#6366f1"; // Indigo-500
    titleText = "Milestone Moment! 🌟";
    bannerText = "HRMS-CE Career Milestone";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #e0e7ff; border: 1px solid #c7d2fe; border-radius: 12px; display: flex; align-items: center;">
        <div style="font-size: 24px; margin-right: 12px;">🌟</div>
        <div>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #3730a3;">An Anniversary Token of Gratitude</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #4338ca;">We've added extra reward points to your company profile!</p>
        </div>
      </div>
    `;
  } else if (campaignType === "Payslip") {
    headerColor = "#10b981"; // Emerald-500
    titleText = "Payslip Processed 💰";
    bannerText = "HRMS-CE Payroll Department";
    accentBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #d1fae5; border: 1px solid #a7f3d0; border-radius: 12px; display: flex; align-items: center;">
        <div style="font-size: 24px; margin-right: 12px;">🔒</div>
        <div>
          <p style="margin: 0; font-size: 13px; font-weight: bold; color: #065f46;">Secure Document</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #047857;">Your payslip is securely stored in the Employee Portal.</p>
        </div>
      </div>
    `;
  }

  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="500px" style="max-width: 500px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; border-collapse: separate;" cellspacing="0" cellpadding="0">
                <!-- Header -->
                <tr>
                  <td style="background-color: ${headerColor}; padding: 24px; text-align: center;">
                    <p style="margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; font-weight: bold; color: rgba(255,255,255,0.85);">${bannerText}</p>
                    <h1 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${titleText}</h1>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 24px; text-align: left;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #1e293b;">Dear ${employeeName},</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569; white-space: pre-wrap;">${body}</p>

                    ${accentBlock}

                    <div style="margin-top: 24px; text-align: center;">
                      <a href="${process.env.APP_URL || "https://ai.studio"}" style="display: inline-block; padding: 10px 20px; background-color: ${headerColor}; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                        Open Employee Portal
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 24px; text-align: center; font-size: 10px; color: #64748b;">
                    <p style="margin: 0; font-weight: bold; color: #475569;">HRMS-CE Operations & Internal Communications</p>
                    <p style="margin: 4px 0 0 0;">This is an automated operational email sent on behalf of HRMS-CE Inc.</p>
                    <p style="margin: 2px 0 0 0;">© 2026 HRMS-CE Inc. 123 Business Ave, Suite 400, San Francisco, CA.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
