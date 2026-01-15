"use client";
import Form from "next/form";
import { useActionState, useState } from "react";
import { type SignupFormState } from "~/actions/signup";
import { SignupAction } from "~/actions/signup";
import {
  VStack,
  Stack,
  Input,
  Link,
  Text,
  NativeSelect,
  Button,
} from "@chakra-ui/react";
import { Field } from "~/components/ui/field";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { LuArrowRight } from "react-icons/lu";
import { GoogleSignInButton } from "./googleLogin";

export const SignupForm = () => {
  const initialFormState: SignupFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    SignupAction,
    initialFormState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Form action={formAction}>
      {newFormState.success ? (
        <VStack textAlign={"center"} gap={4}>
          <Text>
            Your account has been created successfully. You can now log in using
            your credentials.
          </Text>

          <Link href="/auth/login">
            <Button>Go to Login</Button>
          </Link>
        </VStack>
      ) : (
        <Stack gap="4">
          <Field
            label="Firstname"
            errorText={newFormState.errors?.firstName}
            invalid={!!newFormState.errors?.firstName}
          >
            <Input
              type="text"
              autoComplete="Firstname"
              placeholder={"Enter your first name"}
              name="firstName"
              defaultValue={newFormState.values?.firstName || ""}
            />
          </Field>

          <Field
            label="Lastname"
            errorText={newFormState.errors?.lastName}
            invalid={!!newFormState.errors?.lastName}
          >
            <Input
              type="text"
              autoComplete="Lastname"
              name="lastName"
              placeholder={"Enter your last name"}
              defaultValue={newFormState.values?.lastName || ""}
            />
          </Field>

          <Field
            label="Email"
            errorText={newFormState.errors?.email}
            invalid={!!newFormState.errors?.email}
          >
            <Input
              type="email"
              autoComplete="email"
              name="email"
              placeholder={"example@mail.com"}
              defaultValue={newFormState.values?.email}
            />
          </Field>

          {/* <Field
            label="Gender"
            errorText={newFormState.errors?.gender}
            invalid={!!newFormState.errors?.gender}
          >
            <NativeSelect.Root>
              <NativeSelect.Field
                placeholder="Select option"
                name="gender"
                defaultValue={newFormState.values?.gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field> */}

          <Field
            label="Password"
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

          <Button type="submit" loading={isPending} disabled={isPending}>
            Signup <LuArrowRight />
          </Button>
          <Text color="red.500" textAlign="center">
            {newFormState.errors?.submitError}
          </Text>

           <GoogleSignInButton></GoogleSignInButton>

          <Text color={"fg.muted"} textAlign={"center"} textStyle={"sm"}>
            Already have an account?{" "}
            <Link variant={"underline"} href="/auth/login">
              Login
            </Link>
          </Text>
        </Stack>
      )}
    </Form>
  );
};
