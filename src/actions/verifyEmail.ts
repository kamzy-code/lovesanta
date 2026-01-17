"use server";

import { sendVerificationTokenMail } from "~/lib/common/sendMail";
import { generateVerificationToken } from "~/lib/common/token";
import { getUserByEmail } from "~/lib/db/users";
import { getVerificationTokenByToken } from "~/lib/db/verificationToken";
import { db } from "~/server/db";

export async function verifyEmail(token: string) {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(verificationToken.expires) < new Date();

  console.log("hasExpired", hasExpired);
  if (hasExpired) {
    const newToken = await generateVerificationToken(
      verificationToken.identifier,
    );
    await sendVerificationTokenMail(newToken.identifier, newToken.token);
    return {
      error: "Token has expired, a new token has been sent to your email.",
    };
  }

  const user = await getUserByEmail(verificationToken.identifier);

  if (!user) {
    return { error: "User does not exist!" };
  }

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), email: verificationToken.identifier },
  });

  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return { success: "Email verified successfully!" };
}
