"use client";
import { Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { verifyEmail } from "~/actions/verifyEmail";

export function VerificationHandler({ token }: { token: string }) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Invalid verification token!");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <Stack textAlign={"center"}>
      {!success && !error && (
        <Stack>
          <Button variant={"ghost"} loading disabled></Button>
          <Text color="fg.muted">Verifying your email address...</Text>
        </Stack>
      )}

      {success && <Text color="green.500">{success}</Text>}

      {error && <Text color="red.500">{error}</Text>}

      <Button disabled={success === undefined && error === undefined}>
        <Link href={"/auth/login"}> Back to Login </Link>
      </Button>
    </Stack>
  );
}
