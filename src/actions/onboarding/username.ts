"use server";

import { redirect } from "next/navigation";
import { get } from "~/lib/common/getFromFormData";
import { sendPasswordResetMail } from "~/lib/common/sendMail";
import { generatePasswordResetToken } from "~/lib/common/token";
import { getUserByEmail, getUserById } from "~/lib/db/users";
import { resetPasswordSchema, usernameOnboardSchema } from "~/schemas";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

interface UsernameOnboardFormValues {
  username: string;
}

export type UsernameOnboardFormError = {
  submitError?: string;
} & Partial<UsernameOnboardFormValues>;

export interface UsernameOnboardFormState {
  success: boolean;
  errors?: UsernameOnboardFormError;
  values?: UsernameOnboardFormValues;
}

export const usernameOnboardAction = async (
  initialValue: UsernameOnboardFormState | undefined,
  formData: FormData,
) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }
  const username = get("username", formData);

  const result = await usernameOnboardSchema.safeParseAsync({ username });

  if (!result.success) {
    return {
      success: false,
      errors: {
        username: result.error.errors[0]?.message || "Enter a valid username",
      },
      values: { username },
    } as UsernameOnboardFormState;
  }

  const { username: validatedUsername } = result.data;

  try {
    const user = await getUserById(session?.user.id, true);

    if (!user) {
      return {
        success: false,
        errors: {
          submitError: "User not found.",
        },
        values: { username },
      } as UsernameOnboardFormState;
    }

    await db.user.update({
      where: { id: user.id },
      data: { username: validatedUsername },
    });

    console.log("Username updated successfully.");
  } catch (error) {
    return {
      success: false,
      errors: {
        submitError:
          "Something went wrong. Please check your internet connection and try again.",
      },
      values: { username },
    } as UsernameOnboardFormState;
  }

  redirect("/home");
};
