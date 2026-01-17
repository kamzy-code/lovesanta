import { db } from "~/server/db";

export const getPasswordResetTokenByEmail = async (
  email: string,
  throwError?: boolean,
) => {
  try {
    const token = await db.passwordResetToken.findFirst({
      where: { identifier: email.toLowerCase().trim() },
    });
    return token;
  } catch (error) {
    if (throwError && error instanceof Error) throw new Error(error.message);
    return null;
  }
};

export const getPasswordResetTokenByToken = async (
  token: string,
  throwError?: boolean,
) => {
  try {
    const PasswordResetToken = await db.passwordResetToken.findUnique({
      where: { token: token },
    });
    return PasswordResetToken;
  } catch (error) {
    if (throwError && error instanceof Error) throw new Error(error.message);
    return null;
  }
};
