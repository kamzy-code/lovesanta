"use server";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { get } from "~/app/common/getFromFormData";
import { loginSchema } from "~/schemas";
import { signIn } from "~/server/auth/index";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: string;
}

export type LoginFormError = {
  submitError?: string;
} & Partial<LoginFormValues>;

export interface LoginFormState {
  success: boolean;
  errors?: LoginFormError;
  values?: Partial<LoginFormValues>;
}

export async function LoginAction(
  initialValue: LoginFormState | undefined,
  formData: FormData,
) {
  const errors: LoginFormError = {};

  const values: LoginFormValues = {
    email: get("email", formData),
    password: get("password", formData),
    rememberMe: get("rememberMe", formData) || "off",
  };

  const result = loginSchema.safeParse(values as unknown);

  if (!result.success) {
    result.error.errors.forEach((issue) => {
      const key = issue.path[0] as keyof LoginFormError | undefined;
      const message = issue.message;
      if (key) {
        errors[key] = message;
      } else {
        errors.submitError = message;
      }
    });
  }

  if (Object.keys(errors).length > 0) {
    const response: LoginFormState = {
      success: false,
      errors,
      values,
    };
    return response;
  }

  const { email, password, rememberMe } = result.data!;

  try {
    await signIn("credentials", {
      email,
      password,
      rememberMe,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const response: LoginFormState = {
        success: false,
        errors: { ...errors },
        values,
      };
      switch (error.type) {
        case "CredentialsSignin":
          if (response.errors)
            response.errors.submitError = "Invalid email or password.";
          return response;
        default:
          if (response.errors)
            response.errors.submitError =
              "An unknown error occurred. Please try again.";
          return response;
      }
    }
    throw error;
  }

  return { success: true, errors: {}, values: {} } as LoginFormState;
}
