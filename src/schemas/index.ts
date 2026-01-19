import z from "zod";
import { getUserByUsername } from "~/lib/db/users";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.string().optional(),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine(async (data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    const existingUser = await getUserByUsername(data.username);
    if (existingUser) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username already exists",
        path: ["username"],
      });
    }
  });

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
});

export const usernameOnboardSchema = z.object({
  username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username is too long"),
})
  .superRefine(async (data, ctx) => {
    const existingUser = await getUserByUsername(data.username);
    if (existingUser) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username already exists",
        path: ["username"],
      });
    }
  });

export const newPasswordSchema = z
  .object({
    token: z.string().min(1, "First name is required"),
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
