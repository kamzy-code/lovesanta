import { Stack, Text } from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "routes";

export function GoogleSignInButton() {
  const handleLoginWithGoogle = async () => {
    await signIn("google", {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <Stack gap={"4"}>
      <Text textAlign={"center"}>Continue with</Text>
      <Button gap={"2"} onClick={handleLoginWithGoogle}>
        <FaGoogle></FaGoogle> Google
      </Button>
    </Stack>
  );
}
