"use client";
import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";
import { Stack, Input, Text, Button } from "@chakra-ui/react";
import { Field } from "~/components/ui/field";
import { LuArrowRight } from "react-icons/lu";
import {
  EditEventFormState,
  editEventAction,
} from "~/actions/events/editEvent";
import { formatDateToString } from "~/lib/common/helpers";
import { Event } from "@prisma/client";
import { api } from "~/trpc/react";
import { PageLoader } from "~/components/ui/pageLoader";


export const EditEventForm = ({ eventId, onClose }: { eventId: string, onClose: () => void}) => {
  const utils = api.useUtils();
  const initialFormState: EditEventFormState = {
    success: false,
    errors: {},
  };

  const {data: event, isLoading} = api.event.getById.useQuery({eventId})

  const [newFormState, formAction, isPending] = useActionState(
    editEventAction,
    initialFormState,
  );

  const hasHandledSuccess = useRef(false);

  useEffect(() => {
    if (newFormState.success && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true;
      void utils.event.getById.invalidate({eventId});
      void utils.event.getBySlug.invalidate({slug: event?.slug || ""});
      onClose();
    }
  }, [newFormState.success, onClose, eventId, event?.slug, utils]);

  if (isLoading) {
    return <Text textAlign={'center'}>Loading...</Text>
  }

  return (
    <Form action={formAction}>
      <Input type="hidden" name="eventId" value={event?.id} />

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
            defaultValue={newFormState.values?.title || event?.title || ""}
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
            defaultValue={newFormState.values?.description || event?.description || ""}
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
            defaultValue={
              newFormState.values?.date
                ? formatDateToString(newFormState.values.date)
                : event?.date
                ? formatDateToString(event.date)
                : ""
            }
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
            defaultValue={newFormState.values?.location || event?.location || ""}
          />
        </Field>

        <Button type="submit" loading={isPending} disabled={isPending}>
          Update Event <LuArrowRight />
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
