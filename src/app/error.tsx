"use client";

import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Center minH="80dvh" px={4}>
      <VStack gap={4} textAlign="center" maxW="sm">
        <Heading size="xl">Something went wrong</Heading>
        <Text color="fg.muted">
          The page hit an unexpected error. Try again, or head back home.
        </Text>
        <VStack w="full" gap={3}>
          <Button w="full" size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Link href="/home" style={{ width: "100%" }}>
            <Button w="full" size="lg" variant="outline">
              Back to home
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Center>
  );
}
