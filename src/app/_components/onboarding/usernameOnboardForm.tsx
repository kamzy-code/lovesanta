"use client";
import { Input, Stack, Text } from "@chakra-ui/react";
import Form from "next/form";
import { useActionState } from "react";
import { usernameOnboardAction, type UsernameOnboardFormState } from "~/actions/onboarding/username";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";

export const UsernameOnboardForm = () => {
  const initialState: UsernameOnboardFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    usernameOnboardAction,
    initialState,
  );

  return (
    <Form action={formAction}>
      <Stack gap="6">
        <Field
          errorText={newFormState.errors?.username}
          invalid={!!newFormState.errors?.username}
          label="Username"
        >
          <Input
            type="text"
            autoComplete="username"
            name="username"
            placeholder={"Enter your username"}
            defaultValue={newFormState.values?.username}
          />
        </Field>

        <Stack gap="4">
          <Button type="submit" loading={isPending} disabled={isPending}>
            Submit
          </Button>

          {newFormState.errors?.submitError && (
            <Text color={"red.500"} fontSize={"sm"}>
              {newFormState.errors.submitError}
            </Text>
          )}
          {newFormState.success && (
            <Text color={"green.500"} fontSize={"sm"}>
             Username updated successfully.
            </Text>
          )}
        </Stack>
      </Stack>
    </Form>
  );
};
