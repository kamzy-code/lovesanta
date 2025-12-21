import { db } from "~/server/db";

export const getUserByEmail = async (email: string, throwError?: boolean) => {
  try {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    return user;
  } catch (error) {
    if (throwError && error instanceof Error) throw new Error(error.message)
    return null;
  }
};

export const getUserById = async (id: string, throwError?: boolean) => {
  try {
    const user = await db.user.findUnique({
      where: { id: id },
    });
    return user;
  } catch (error) {
     if (throwError && error instanceof Error) throw new Error(error.message)
    return null;
  }
};
