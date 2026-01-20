"use client";
import Form from "next/form";
import { useActionState,} from "react";
import { Stack, Input, Text, Button } from "@chakra-ui/react";
import { Field } from "~/components/ui/field";
import { LuArrowRight } from "react-icons/lu";
import { createEventAction, CreateEventFormState } from "~/actions/events/create";
import { formatDateToString } from "~/lib/common/helpers";

export const CreateEventForm = () => {
  const initialFormState: CreateEventFormState= {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    createEventAction,
    initialFormState,
  );

  return (
    <Form action={formAction}>
      <Stack gap="4">
        <Field
          label="Title"
          required
          errorText={newFormState.errors?.title}
          invalid={!!newFormState.errors?.title}
        >
          <Input
            type="text"
            autoComplete="title"
            placeholder={"Enter a title for your event"}
            name="title"
            defaultValue={newFormState.values?.title || ""}
          />
        </Field>

        <Field
          label="Description"
          errorText={newFormState.errors?.description}
          invalid={!!newFormState.errors?.description}
        >
          <Input
            type="text"
            autoComplete="description"
            placeholder={"Enter a description for your event"}
            name="description"
            defaultValue={newFormState.values?.description || ""}
          />
        </Field>

        <Field
          label="Date"
          required
          errorText={newFormState.errors?.date}
          invalid={!!newFormState.errors?.date}
        >
          <Input
            type="date"
            autoComplete="date"
            placeholder={"When is your event?"}
            name="date"
            defaultValue={newFormState.values?.date ? formatDateToString(newFormState.values.date) : ""}
          />
        </Field>

        <Field
          label="Location"
          errorText={newFormState.errors?.location}
          invalid={!!newFormState.errors?.location}
        >
          <Input
            type="text"
            autoComplete="location"
            placeholder={"Enter a location for your event if applicable"}
            name="location"
            defaultValue={newFormState.values?.location || ""}
          />
        </Field>

        <Button type="submit" loading={isPending} disabled={isPending}>
          Create Event <LuArrowRight />
        </Button>

        {newFormState.errors?.submitError && (
          <Text color="red.500" textAlign="center">
            {newFormState.errors?.submitError}
          </Text>
        )}
      </Stack>
    </Form>
  );
};
