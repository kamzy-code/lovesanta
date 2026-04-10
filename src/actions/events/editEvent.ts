"use server";
import { get } from "~/lib/common/getFromFormData";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface EditEventFormValue {
  eventId: string;
  title: string;
  description?: string;
  date: Date;
  location?: string;
}

export type EditEventFormError = {
  date?: string;
  submitError?: string;
} & Partial<Pick<EditEventFormValue, "title" | "description" | "location">>;

export interface EditEventFormState {
  success: boolean;
  errors?: EditEventFormError;
  values?: Partial<EditEventFormValue>;
}

export const editEventAction = async (
  initialState: EditEventFormState | undefined,
  formData: FormData,
) => {
  const errors: EditEventFormError = {};
  const values: EditEventFormValue = {
    eventId: get("eventId", formData),
    title: get("title", formData),
    description: get("description", formData),
    date: new Date(get("date", formData)),
    location: get("location", formData),
  };

  try {
    const event = await api.event.editEvent(values);

    // Invalidate the cache for the home page before redirecting
    revalidatePath(`/event/${event.slug}`);
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
      errors.submitError = "Failed to create event. Please try again.";
    }

    return { success: false, errors, values } as EditEventFormState;
  }

return { success: true, errors: {} } as EditEventFormState; 
};
