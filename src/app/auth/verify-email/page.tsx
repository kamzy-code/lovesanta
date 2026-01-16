import { Container, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

import { VerificationHandler } from "~/app/_components/auth/verificationHandler";
import { Button } from "~/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Container maxW="sm" py={{ base: "12", md: "24" }}>
      <Stack gap="8" alignItems={'center'}>
        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Verify Email
          </Heading>
        </Stack>
        <VerificationHandler token={token} />

       
      </Stack>
    </Container>
  );
}
