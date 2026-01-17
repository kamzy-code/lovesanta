import { nanoid } from "nanoid";
import { getVerificationTokenByEmail } from "../db/verificationToken";
import { db } from "~/server/db";
import { getPasswordResetTokenByEmail } from "../db/passwordResetToken";

export const generateVerificationToken = async (email: string) => {
  const token = nanoid();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000); // expires after 30 minutes

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email.toLowerCase().trim(),
      token,
      expires,
    },
  });

  return verificationToken;
};


export const generatePasswordResetToken = async (email: string) => {
  const token = nanoid();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000); // expires after 30 minutes

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      identifier: email.toLowerCase().trim(),
      token,
      expires,
    },
  });

  return passwordResetToken;
};