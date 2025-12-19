import {
  Container,
  VStack,
  Stack,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { SignupForm } from "./signupForm";



export function SignupStack() {
  return (
    <Container maxW="sm" py={{ base: "12", }}>
      <Stack gap="8">
        <VStack gap={{ base: "2", md: "3" }} textAlign={"center"}>
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Signup
          </Heading>
          <Text color="fg.muted">Create a Hangnex account</Text>
        </VStack>

        <SignupForm />
      </Stack>
    </Container>
  );
}

