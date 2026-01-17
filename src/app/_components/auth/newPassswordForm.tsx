"use client";
import { Input, Stack, Text } from "@chakra-ui/react";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  newPasswordAction,
  type NewPasswordFormState,
} from "~/actions/new-password";
import { Button } from "~/components/ui/button";
import { Field } from "~/components/ui/field";

export const NewPasswordForm = ({ token }: { token: string }) => {
  const initialState: NewPasswordFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    newPasswordAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form action={formAction}>
      {newFormState.success ? (
        <Stack gap="6">
          <Text color={"green.500"} fontSize={"sm"} textAlign={"center"}>
            Your password has been reset successfully.
          </Text>

          <Link href={"/auth/login"}>
            <Button w={'full'}>Back to Login</Button>
          </Link>
        </Stack>
      ) : (
        <Stack gap="6">
          <Field hidden label="Token">
            <Input type="text" name="token" value={token} />
          </Field>

          <Field
            label="Enter a new password"
            errorText={newFormState.errors?.password}
            invalid={!!newFormState.errors?.password}
          >
            <Input
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              placeholder={"Enter your password"}
              defaultValue={newFormState.values?.password}
            />

            <Button
              variant={"ghost"}
              position={"absolute"}
              right={"1"}
              top={"6"}
              padding={"0"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </Button>
          </Field>

          <Field
            label="Confirm Password"
            errorText={newFormState.errors?.confirmPassword}
            invalid={!!newFormState.errors?.confirmPassword}
          >
            <Input
              type={`${showConfirmPassword ? "text" : "password"}`}
              name="confirmPassword"
              placeholder={"Confirm your password"}
              defaultValue={newFormState.values?.confirmPassword}
            />

            <Button
              variant={"ghost"}
              position={"absolute"}
              right={"1"}
              top={"6"}
              padding={"0"}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </Button>
          </Field>

          <Stack gap="4">
            <Button type="submit" loading={isPending} disabled={isPending}>
              Reset Password
            </Button>

            {newFormState.errors?.submitError && (
              <Text color={"red.500"} fontSize={"sm"}>
                {newFormState.errors.submitError}
              </Text>
            )}
          </Stack>
        </Stack>
      )}
    </Form>
  );
};
