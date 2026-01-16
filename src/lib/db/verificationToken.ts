import { db } from "~/server/db";

export const getVerificationTokenByEmail = async (
  email: string,
  throwError?: boolean,
) => {
  try {
    const token = await db.verificationToken.findFirst({
      where: { identifier: email.toLowerCase().trim() },
    });
    return token;
  } catch (error) {
    if (throwError && error instanceof Error) throw new Error(error.message);
    return null;
  }
};

export const getVerificationTokenByToken = async (
  token: string,
  throwError?: boolean,
) => {
  try {
    const VerificationToken = await db.verificationToken.findUnique({
      where: { token: token },
    });
    return VerificationToken;
  } catch (error) {
    if (throwError && error instanceof Error) throw new Error(error.message);
    return null;
  }
};
