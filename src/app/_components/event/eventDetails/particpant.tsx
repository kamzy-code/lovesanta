import { Box, Container, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "~/components/ui/avatar";
import { auth } from "~/server/auth";
import { ParticipantWithUser } from "~/types";

export const ParticipantList = async ({
  participants,
}: {
  participants: ParticipantWithUser[];
}) => {
  const session = await auth();
  const you = participants.find((p) => p.userId === session?.user.id);
  return (
    <Container>
      {you && (
        <HStack>
          <Stack pb={2}>
            <Avatar
              bg={{
                base: "teal.300",
                _dark: "linear-gradient(40deg, blue, purple, #81f242)",
              }}
              size="lg"
              name={you?.user.username ?? "USER"}
            />
          </Stack>
          <Box>
            <Text fontWeight={"bold"}>You</Text>
            <Text color={"fg.muted"}>
              {`Wishlist: ${you.wishlist ?? "Anything"}`}
            </Text>
          </Box>
        </HStack>
      )}

      {participants
        .filter((p) => p.userId !== session?.user.id)
        .map((participant) => {
          return (
            <HStack key={participant.id}>
              <Stack pb={2}>
                <Avatar
                  bg={{
                    base: "teal.300",
                    _dark: "linear-gradient(40deg, blue, purple, #81f242)",
                  }}
                  size="lg"
                  name={participant.user.username ?? "USER"}
                />
              </Stack>
              <Box>
                <Text fontWeight={"bold"}>{participant.user.username}</Text>
                <Text color={"fg.muted"}>
                  {`Wishlist: ${participant.wishlist ?? "Anything"}`}
                </Text>
              </Box>
            </HStack>
          );
        })}
    </Container>
  );
};
