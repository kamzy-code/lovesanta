"use server";
import { z } from "zod";
import { get } from "~/app/common/getFromFormData";
import { db } from "~/server/db";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    gender: z.string().min(1, "Please select a gender"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export interface SignupFormValue {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
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

  const values = {
    firstName: get("firstName", formData),
    lastName: get("lastName", formData),
    email: get("email", formData),
    gender: get("gender", formData),
    password: get("password", formData),
    confirmPassword: get("confirmPassword", formData),
  };

  const result = signupSchema.safeParse(values as unknown);

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

  const existingUser = await db.user.findUnique({
    where: {
      email: values.email,
    },
  });

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

  try {
    await db.user.create({
      data:{
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        password: values.password
      }
    })
  } catch (error) {
    return {
      success: false,
      errors: {
        submitError:
          "An account with this email already exists. Please use a different email.",
      },
      values,
    }
    
  }
  return { success: true, errors: {}, values: {} };
}
