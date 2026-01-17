import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { NewPasswordForm } from "~/app/_components/auth/newPassswordForm";


export default async function NewPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  return (
    <Container maxW="sm" py={{ base: "12", md: "24" }}>
      <Stack gap="8">
        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Reset Password
          </Heading>
          <Text color={"fg.muted"}>Reset your password</Text>
        </Stack>
        <NewPasswordForm token={token} />
      </Stack>
    </Container>
  );
}
