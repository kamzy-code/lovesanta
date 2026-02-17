"use server";
import { get } from "~/lib/common/getFromFormData";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type ActivityType } from "@prisma/client";

export interface AddActivityFormValue {
  activity: string;
  eventId: string;
  budget?: string;
}

export type AddActivityFormError = {
  submitError?: string;
} & Partial<AddActivityFormValue>;

export interface AddActivityFormState {
  success: boolean;
  errors?: AddActivityFormError;
  values?: Partial<AddActivityFormValue>;
}

export const addActivityAction = async (
  initialState: AddActivityFormState | undefined,
  formData: FormData,
) => {
  const errors: AddActivityFormError = {};
  const values: AddActivityFormValue = {
    activity: get("activity", formData),
    budget: get("budget", formData),
    eventId: get("eventId", formData),
  };

  console.log(values);

  if (values.activity === "GIFTING" && !values.budget) {
    const response: AddActivityFormState = {
      success: false,
      errors: {
        budget: "Add a minimum budget for gifts",
      },
      values,
    };

    return response;
  }

  const activity = {
    eventId: values.eventId,
    type: values.activity as ActivityType,
    settings: {
      ...(values.activity === "GIFTING"
        ? {
            budget: values.budget,
          }
        : {}),
    },
  };

    console.log(activity);
  try {
    await api.activity.addActivity(activity);
  } catch (error) {
    // Handle TRPC validation errors
    if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
      const cause = error.cause;

      // Check if it's a Zod error
      if (cause && typeof cause === "object" && "issues" in cause) {
        const issues = (cause as any).issues || [];

        // Map Zod error issues to form field errors
        issues.forEach((issue: any) => {
          const path = issue.path?.[0];
          if (path && typeof path === "string") {
            (errors as any)[path] = issue.message;
          }
        });

        // If no field-specific errors were set, show a generic error
        if (Object.keys(errors).length === 0) {
          errors.submitError = "Please check your inputs and try again.";
        }
      } else {
        errors.submitError = "Validation failed. Please check your inputs.";
      }
    } else {
      errors.submitError = "Failed to ad activity. Please try again.";
    }

    return { success: false, errors, values } as AddActivityFormState;
  }

 
  return { success: true, errors, values } as AddActivityFormState;
};
