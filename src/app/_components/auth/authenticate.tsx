"use client";

import {
  Container,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Field } from "~/components/ui/field";
import { PinInput } from "~/components/ui/pin-input";
import { LuArrowRight } from "react-icons/lu";

import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "../../../lib/common/routes";
import Form from "next/form";
import { LoginAction, type LoginFormState } from "~/actions/login";
import { useActionState, useState } from "react";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { GoogleSignInButton } from "./googleLogin";
import { useSearchParams } from "next/navigation";
import { error } from "console";

export const AuthenticateStack = () => {
  /**
   * @operation
   * When we already have a user session, we can redirect the user to the home page
   * or do a conditional render of the root app page, however in this case, we are
   * redirecting the user to the home page.
   */
  const session = useSession();
  if (session?.data?.user) {
    redirect(routes.home);
  }

  return (
    <Container maxW="sm" py={{ base: "12", md: "24" }}>
      <Stack gap="8">
        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Welcome back
          </Heading>
          <Text color="fg.muted">Sign in with your username to begin</Text>
        </Stack>

        <CredentialForm />

       

        <Text textStyle="sm" color="fg.muted" textAlign="center">
          {`Don't have an account?`}{" "}
          <Link variant="underline" href="/auth/signup">
            Signup
          </Link>
        </Text>
      </Stack>
    </Container>
  );
};

export const CredentialForm = () => {
  const initialState: LoginFormState = {
    success: false,
    errors: {},
  };

  const [newFormState, formAction, isPending] = useActionState(
    LoginAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const LoginError = searchParams.get("error");

  return (
    <Form action={formAction}>
      <Stack gap="6">
        <VStack gap="6">
          <Field
            errorText={newFormState.errors?.email}
            invalid={!!newFormState.errors?.email}
            label="Email"
          >
            <Input
              type="email"
              autoComplete="email"
              name="email"
              placeholder={"example@mail.com"}
              defaultValue={newFormState.values?.email}
            />
          </Field>

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
        </VStack>

        <Stack gap="4">
          <HStack justify="space-between">
            <Checkbox defaultChecked name="rememberMe">
              Remember me
            </Checkbox>
            <Link href="/auth/reset-password">
              <Button variant="plain" size="sm">
                Forgot password
              </Button>
            </Link>
          </HStack>
          <Button type="submit" loading={isPending} disabled={isPending}>
            Sign in <LuArrowRight />
          </Button>

          {newFormState.errors?.submitError && (
            <Text color={"red.500"} fontSize={"sm"}>
              {newFormState.errors.submitError}
            </Text>
          )}

          {LoginError &&(
            <Text color={"red.500"} fontSize={"sm"}>
              Something went wrong. Please check your internet and try again.
            </Text>
          )}

           <GoogleSignInButton></GoogleSignInButton>
        </Stack>
      </Stack>
    </Form>
  );
};
