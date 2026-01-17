import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { ResetPasswordForm} from "~/app/_components/auth/forgotPassword";

export default async function ResetPasword(){
  return (
    <Container maxW="sm" py={{ base: "12", md: "24" }}>
      <Stack gap="8" >
        <Stack gap={{ base: "2", md: "3" }} textAlign="center">
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Forgot Password
          </Heading>
          <Text color={'fg.muted'}>Forgot your password?</Text>
        </Stack>

       <ResetPasswordForm/>
      
      </Stack>
    </Container>
  );
}
