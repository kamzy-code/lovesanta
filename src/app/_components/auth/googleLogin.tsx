import { Stack, Text } from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "routes";
import { useTransition } from "react";

export function GoogleSignInButton({
  eventSlug,
}: {
  eventSlug?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const handleLoginWithGoogle = () => {
    startTransition(
      async () =>
        void (await signIn("google", {
          redirectTo: eventSlug
            ? `/event/${eventSlug}`
            : DEFAULT_LOGIN_REDIRECT,
        })),
    );
  };
  return (
    <Stack gap={"4"}>
      <Text textAlign={"center"}>Continue with</Text>
      <Button
        gap={"2"}
        loading={isPending}
        disabled={isPending}
        onClick={handleLoginWithGoogle}
      >
        <FaGoogle></FaGoogle> Google
      </Button>
    </Stack>
  );
}
