import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { UsernameOnboardForm } from "~/app/_components/onboarding/usernameOnboardForm";

export default function UsernameOnboardingPage() {
  return (
    <Container maxW="sm" py={{ base: "12", md: "24" }}>
      <Stack gap="8">
        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Choose a Username
          </Heading>
          <Text color={"fg.muted"}>Choose a username to get started</Text>
        </Stack>
        <UsernameOnboardForm />
      </Stack>
    </Container>
  );
}
