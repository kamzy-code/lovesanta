"use server";

import { get } from "~/lib/common/getFromFormData";
import { sendPasswordResetMail } from "~/lib/common/sendMail";
import { generatePasswordResetToken } from "~/lib/common/token";
import { getUserByEmail } from "~/lib/db/users";
import { resetPasswordSchema } from "~/schemas";

interface ResetPasswordFormValues {
  email: string;
}

export type ResetPasswordFormError = {
  submitError?: string;
} & Partial<ResetPasswordFormValues>;

export interface ResetPasswordFormState {
  success: boolean;
  errors?: ResetPasswordFormError;
  values?: ResetPasswordFormValues;
}

export const resetPasswordAction = async (
  initialValue: ResetPasswordFormState | undefined,
  formData: FormData,
) => {
  const email = get("email", formData);

  const result = resetPasswordSchema.safeParse({ email });

  if (!result.success) {
    return {
      success: false,
      errors: {
        email: result.error.errors[0]?.message || "Enter a valid email address",
      },
      values: { email },
    } as ResetPasswordFormState;
  }

  const { email: validatedEmail } = result.data;

  const user = await getUserByEmail(validatedEmail);

  if (!user) {
    return {
      success: false,
      errors: {
        submitError: "Account with this email doesn't exist",
      },
      values: { email },
    } as ResetPasswordFormState;
  }

  const passowrdResetToken = await generatePasswordResetToken(user.email!);
  await sendPasswordResetMail(
    passowrdResetToken.identifier,
    passowrdResetToken.token,
  );

  return { success: true } as ResetPasswordFormState;
};
