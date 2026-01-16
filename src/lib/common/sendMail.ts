"server-only";

import { baseURL } from "routes";
import { sendEmail } from "./mailTranspot";


// VERIFICATION EMAIL AND HELPERS
export const sendVerificationTokenMail = async (to: string, token: string) => {
  const subject = "Verify your email address";
  const verificationURL = `${baseURL}/auth/verify-email?token=${token}`;

  const html = verificationEmailHTML(verificationURL);
  const text = verificationEmailText(verificationURL);

  try {
    await sendEmail(subject, text, to, html);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to verification email";
    throw new Error(message || "Error sending verification email");
  }
};

function verificationEmailHTML(verificationURL: string) {
  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background-color:#ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding: 32px 16px;">

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px; border:1px solid #e5e5e5;">
            <tr>
              <td style="padding:32px; color:#000000;">

                <!-- Brand -->
                <h1 style="margin:0 0 24px 0; font-size:20px; font-weight:600; text-align:center;">
                  Hangnex
                </h1>

                <p style="margin:0 0 16px 0; font-size:14px; line-height:1.6;">
                  Welcome to Hangnex 👋
                </p>

                <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6;">
                  Please verify your email address to complete your account setup.
                </p>

                <!-- Button -->
                <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin:32px auto;">
                  <tr>
                    <td>
                      <a
                        href="${verificationURL}"
                        style="
                          display:inline-block;
                          padding:12px 24px;
                          background-color:#000000;
                          color:#ffffff;
                          text-decoration:none;
                          font-size:14px;
                          font-weight:500;
                          border:1px solid #000000;
                        "
                      >
                        Verify Email Address
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px 0; font-size:12px; color:#555555;">
                  Or copy and paste this link into your browser:
                </p>

                <p style="margin:0 0 24px 0; font-size:12px; word-break:break-all;">
                  <a href="${verificationURL}" style="color:#000000;">
                    ${verificationURL}
                  </a>
                </p>

                <hr style="border:none; border-top:1px solid #e5e5e5; margin:32px 0;" />

                <p style="margin:0; font-size:12px; color:#777777;">
                  If you didn’t create a Hangnex account, you can safely ignore this email.
                </p>

              </td>
            </tr>
          </table>

          <p style="margin-top:16px; font-size:11px; color:#999999;">
            © ${new Date().getFullYear()} Hangnex
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

function verificationEmailText(verificationURL: string) {
  return `
Welcome to Hangnex!

Please verify your email address by visiting the link below:

${verificationURL}

If you didn’t create a Hangnex account, you can safely ignore this email.

— Hangnex Team
`.trim();
}


// NEXT EMAIL AND HELPERS GOES HERE