"use client";
import { Input, Stack, Text } from "@chakra-ui/react";
import Form from "next/form";
import { useActionState } from "react";

import {
  type ResetPasswordFormState,
  resetPasswordAction,
} from "~/actions/resetPassword";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";

export const ResetPasswordForm = () => {
  const initialState: ResetPasswordFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <Form action={formAction}>
      <Stack gap="6">
        <Field
          errorText={newFormState.errors?.email}
          invalid={!!newFormState.errors?.email}
          label="Email"
        >
          <Input
            type="email"
            autoComplete="email"
            name="email"
            placeholder={"Enter your email address"}
            defaultValue={newFormState.values?.email}
          />
        </Field>

        <Stack gap="4">
          <Button type="submit" loading={isPending} disabled={isPending}>
            Send Reset Link
          </Button>

          {newFormState.errors?.submitError && (
            <Text color={"red.500"} fontSize={"sm"}>
              {newFormState.errors.submitError}
            </Text>
          )}
          {newFormState.success && (
            <Text color={"green.500"} fontSize={"sm"}>
              A reset link has been sent to your email. Use the Link to reset
              your password
            </Text>
          )}
        </Stack>
      </Stack>
    </Form>
  );
};
