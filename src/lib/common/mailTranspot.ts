import "server-only";
import nodemailer from "nodemailer";

/**
 * @class EmailDeliveryError
 * Thrown when the SMTP server rejects or can't be reached, so callers can
 * show "we couldn't send the email" instead of a generic network error
 */
export class EmailDeliveryError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    // Google shows App Passwords as "xxxx xxxx xxxx xxxx"; SMTP wants them without spaces
    pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ""),
  },
});

export async function sendEmail(
  subject: string,
  text: string,
  to: string,
  html?: string,
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : undefined;
    const message =
      error instanceof Error ? error.message : "Failed to send email";

    // EAUTH usually means the Gmail App Password was revoked or EMAIL_USER is wrong
    console.error(`[sendEmail] ${code ?? "UNKNOWN"}: ${message}`);
    throw new EmailDeliveryError(message, code);
  }
}
