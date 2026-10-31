"use server";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { get } from "~/lib/common/getFromFormData";
import { sendVerificationTokenMail } from "~/lib/common/sendMail";
import { generateVerificationToken } from "~/lib/common/token";
import { getUserByEmail } from "~/lib/db/users";
import { loginSchema } from "~/schemas";
import { signIn } from "~/server/auth/index";
import { db } from "~/server/db";

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
  const eventSlug = get("eventSlug", formData);

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

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email) {
    errors.submitError =
      "No account found with this email. Check the spelling or sign up.";
    const response: LoginFormState = {
      success: false,
      errors,
      values,
    };
    return response;
  }

  // The account exists but was created through an OAuth provider (e.g. Google)
  if (!existingUser.password) {
    const accounts = await db.account.findMany({
      where: { userId: existingUser.id },
      select: { provider: true },
    });
    const providers = accounts.map(
      ({ provider }) => provider.charAt(0).toUpperCase() + provider.slice(1),
    );
    const via = providers.length > 0 ? providers.join(" or ") : "Google";

    errors.submitError = `This account uses ${via} sign-in and has no password yet. Continue with ${via}, then add a password from Profile settings. You can also use "Forgot password" to set one by email.`;
    const response: LoginFormState = {
      success: false,
      errors,
      values,
    };
    return response;
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    try {
      await sendVerificationTokenMail(
        verificationToken.identifier,
        verificationToken.token,
      );
    } catch (error) {
      console.error("[LoginAction] verification email failed", error);
      return {
        success: false,
        errors: {
          submitError:
            "Your email isn't verified yet and we couldn't send a new verification email. Please try again in a few minutes.",
        },
        values,
      };
    }
    return {
      success: false,
      errors: {
        submitError:
          "A new verification email has been sent to you. Please verify your email to log in.",
      },
      values,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      rememberMe,
      redirectTo: eventSlug ? `/event/${eventSlug}` : DEFAULT_LOGIN_REDIRECT,
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
              "An unknown error occurred. Please check your internet and try again..";
          return response;
      }
    }
    throw error;
  }

  return { success: true, errors: {}, values: {} } as LoginFormState;
}
