"use server";
import bcrypt from "bcryptjs";
import { get } from "~/lib/common/getFromFormData";
import { sendPasswordResetMail } from "~/lib/common/sendMail";
import { generatePasswordResetToken } from "~/lib/common/token";
import { getPasswordResetTokenByToken } from "~/lib/db/passwordResetToken";
import { getUserByEmail } from "~/lib/db/users";
import { newPasswordSchema } from "~/schemas";
import { db } from "~/server/db";

interface NewPasswordFormValues {
  token: string;
  password: string;
  confirmPassword: string;
}

export type NewPasswordFormError = {
  submitError?: string;
} & Partial<NewPasswordFormValues>;

export interface NewPasswordFormState {
  success: boolean;
  errors?: NewPasswordFormError;
  values?: NewPasswordFormValues;
}

export async function newPasswordAction(
  initialValue: NewPasswordFormState | undefined,
  formData: FormData,
) {
  const errors: NewPasswordFormError = {};

  const values: NewPasswordFormValues = {
    token: get("token", formData),
    password: get("password", formData),
    confirmPassword: get("confirmPassword", formData),
  };

  const result = newPasswordSchema.safeParse(values);

  if (!result.success) {
    result.error.errors.forEach((issue) => {
      const key = issue.path[0] as keyof NewPasswordFormError | undefined;
      const message = issue.message;
      if (key) {
        errors[key] = message;
      } else {
        errors.submitError = message;
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    const response: NewPasswordFormState = {
      success: false,
      errors,
      values,
    };
    return response;
  }

  const { token, password } = result.data!;
  const resetToken = await getPasswordResetTokenByToken(token);

  if (!resetToken) {
    return {
      success: false,
      errors: { submitError: "Token does not exist!" },
    } as NewPasswordFormState;
  }

  const hasExpired = new Date(resetToken.expires) < new Date();

  if (hasExpired) {
    const newToken = await generatePasswordResetToken(resetToken.identifier);
    await sendPasswordResetMail(newToken.identifier, newToken.token);
    return {
      success: false,
      errors: {
        submitError:
          "Token has expired, a new reset link has been sent to your email.",
      },
    } as NewPasswordFormState;
  }

  const user = await getUserByEmail(resetToken.identifier);

  if (!user) {
    return {
      success: false,
      errors: { submitError: "User does not exist!" },
    } as NewPasswordFormState;
  }

  const hashedPasswod = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPasswod },
  });

  await db.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return { success: true } as NewPasswordFormState;
}
