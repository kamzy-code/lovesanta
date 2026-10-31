import { Container, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { ConfigPanel } from "./auth-card";
import { SignInMethods } from "./sign-in-methods";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { Avatar } from "~/components/ui/avatar";
import { ProfilePasscodeCard } from "./profile-passcode-card";

export const ProfileSettingComponent = async () => {
  const session = await auth();

  const profile = await db.user.findFirst({
    where: {
      id: session?.user?.id,
    },
  });

  if (!profile) {
    return <div>You are not logged in</div>;
  }

  return (
    <Container maxW="xl" px={0} py={{ base: "8", md: "12" }}>
      <Stack pb={2}>
        <Avatar
          bg={{
            base: "teal.300",
            _dark: "linear-gradient(40deg, blue, purple, #81f242)",
          }}
          size="lg"
          name={profile.firstName ?? "Santa Clause"}
        />
      </Stack>

      <Stack gap="6">
        <Stack gap="0" mt={2}>
          <Text textTransform={"uppercase"} textStyle="md">
            {profile.firstName}
          </Text>
          <Text fontWeight={"medium"} color="fg.muted">
            Manage your settings
          </Text>
        </Stack>
        <Stack gap="4">
          <SignInMethods />

          <ConfigPanel></ConfigPanel>
        </Stack>
      </Stack>
    </Container>
  );
};
