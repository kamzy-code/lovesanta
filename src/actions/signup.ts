"use server";
import { get } from "~/lib/common/getFromFormData";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "~/lib/db/users";
import { signupSchema } from "~/schemas";
import { generateVerificationToken } from "~/lib/common/token";
import { sendVerificationTokenMail } from "~/lib/common/sendMail";

export interface SignupFormValue {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupFormError = {
  submitError?: string;
} & Partial<SignupFormValue>;

export interface SignupFormState {
  success: boolean;
  errors?: SignupFormError;
  values?: Partial<SignupFormValue>;
}

export async function SignupAction(
  prevState: SignupFormState | undefined,
  formData: FormData,
) {
  const errors: SignupFormError = {};

  const values: SignupFormValue = {
    firstName: get("firstName", formData),
    lastName: get("lastName", formData),
    username: get("username", formData),
    email: get("email", formData),
    password: get("password", formData),
    confirmPassword: get("confirmPassword", formData),
  };

  const result = await signupSchema.safeParseAsync(values as unknown);

  if (!result.success) {
    result.error.errors.forEach((issue) => {
      const key = issue.path[0] as keyof SignupFormError | undefined;
      const message = issue.message;
      if (key) {
        errors[key] = message;
      } else {
        errors.submitError = message;
      }
    });
  }

  const existingUser = await getUserByEmail(values.email);

  if (existingUser) {
    errors.email = "An account with this email already exists.";
  }

  if (Object.keys(errors).length > 0) {
    const response: SignupFormState = {
      success: false,
      errors,
      values,
    };
    return response;
  }

  const hashedPasswod = await bcrypt.hash(values.password, 10);

  try {
    await db.user.create({
      data: {
        firstName: values.firstName.toLowerCase().trim(),
        lastName: values.lastName.toLowerCase().trim(),
        username: values.username.toLowerCase().trim(),
        email: values.email.toLowerCase().trim(),
        password: hashedPasswod,
      },
    });

    const verificationToken = await generateVerificationToken(values.email);
    //Send Email
    await sendVerificationTokenMail(verificationToken.identifier, verificationToken.token)
  } catch (error) {
    return {
      success: false,
      errors: {
        submitError:
          "Something went worng, Please check your internet and try again.",
      },
      values,
    };
  }
  return { success: true, errors: {}, values: {} } as SignupFormState;
}
