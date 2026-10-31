import { Badge, HStack, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "~/components/ui/avatar";
import { auth } from "~/server/auth";
import { type ParticipantWithUser } from "~/types";

const ParticipantRow = ({
  name,
  isYou,
}: {
  name: string;
  isYou?: boolean;
}) => (
  <HStack gap={3} py={3} borderBottomWidth="1px">
    <Avatar
      bg={{
        base: "teal.300",
        _dark: "linear-gradient(40deg, blue, purple, #81f242)",
      }}
      size="md"
      name={name}
    />
    <Text fontWeight={"semibold"} flex={1} truncate>
      {isYou ? "You" : name}
    </Text>
    {isYou && (
      <Badge variant="subtle" colorPalette="green">
        Joined
      </Badge>
    )}
  </HStack>
);

export const ParticipantList = async ({
  participants,
}: {
  participants: ParticipantWithUser[];
}) => {
  const session = await auth();
  const you = participants.find((p) => p.userId === session?.user.id);

  if (participants.length === 0) {
    return (
      <Text pt={12} textAlign="center" color="fg.muted">
        No one has joined yet
      </Text>
    );
  }

  return (
    <Stack gap={0}>
      <Text fontSize="sm" color="fg.muted" pb={1}>
        {participants.length} participant{participants.length === 1 ? "" : "s"}
      </Text>
      {you && <ParticipantRow name={you.user.username ?? "USER"} isYou />}

      {participants
        .filter((p) => p.userId !== session?.user.id)
        .map((participant) => (
          <ParticipantRow
            key={participant.id}
            name={participant.user.username ?? "USER"}
          />
        ))}
    </Stack>
  );
};
