"server-only";
import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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

  await transporter.verify();
  console.log("Server is ready to take our messages");

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email";
    throw new Error(message || "Error sending mail");
  }
}
