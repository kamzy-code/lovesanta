"use client";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { Stack, Input, Text, Button, NativeSelect } from "@chakra-ui/react";
import { Field } from "~/components/ui/field";
import { LuArrowRight } from "react-icons/lu";
import { type ActivityType } from "@prisma/client";
import {
  addActivityAction,
  type AddActivityFormState,
} from "~/actions/activity/addActivty";
import { api } from "~/trpc/react";

export const AddActivityForm = ({
  onclose,
  eventId,
}: {
  eventId: string;
  onclose: () => void;
}) => {
  const utils = api.useUtils();
  const initialFormState: AddActivityFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    addActivityAction,
    initialFormState,
  );

  const [activityType, setActivityType] = useState<ActivityType | undefined>(
    undefined,
  );

  useEffect(() => {
    if (newFormState.success) {
      void utils.activity.getEventActivities.invalidate({eventId});
      void utils.activity.getEventActivities.refetch({eventId});
      onclose();
    }
  }, [newFormState.success]);

  return (
    <Form action={formAction}>
      <Stack gap="4">
        <Field
          label="Activity"
          required
          errorText={newFormState.errors?.activity}
          invalid={!!newFormState.errors?.activity}
        >
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder="Select Activity"
              name="activity"
              defaultValue={newFormState.values?.activity}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
            >
              <option value="GIFTING">Love Feast</option>
              <option value="TRIVIA">Trivia</option>
              <option value="SCAVENGER">Scavenger Hunt</option>
              <option value="POLLS">Polls</option>
              <option value="ICEBREAKER">Ice Breaker</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field>

        {activityType === "GIFTING" && (
          <Field
            label="Budget"
            errorText={newFormState.errors?.budget}
            invalid={!!newFormState.errors?.budget}
          >
            <Input
              type="text"
              autoComplete="budget"
              placeholder={"Enter a budget for Gifting"}
              name="budget"
              defaultValue={newFormState.values?.budget || ""}
            />
          </Field>
        )}

        <Field hidden label="EventId">
          <Input
            type="text"
            autoComplete="eventId"
            name="eventId"
            defaultValue={eventId}
          />
        </Field>

        <Button type="submit" loading={isPending} disabled={isPending}>
          Add Activity <LuArrowRight />
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
