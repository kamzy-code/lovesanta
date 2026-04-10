import {
  Box,
  Button,
  Center,
  Container,
  Stack,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { ParticipantWithUser } from "~/types";
import { ParticipantList } from "./particpant";
import { auth } from "~/server/auth";
import { ActivityList } from "./activity";
import { FaPlus } from "react-icons/fa6";
import { AddActivityButton } from "./activity/addActivityButton";
import { api, HydrateClient } from "~/trpc/server";
import { db } from "~/server/db";

interface EventTabProps {
  eventId: string;
  isCreator: boolean;
  participants: ParticipantWithUser[];
}

export async function EventTabs({
  participants,
  eventId,
  isCreator,
}: EventTabProps) {
  const session = await auth();

  // Get participant ID for current user if they're enrolled
  let participantId: string | undefined;
  if (session) {
    const participant = await db.participant.findFirst({
      where: {
        eventId,
        userId: session.user.id,
      },
    });
    participantId = participant?.id;
  }

  await api.activity.getEventActivities.prefetch({
    eventId,
  });

  return (
    <Tabs.Root
      defaultValue="activities"
      display="flex"
      flexDirection="column"
      flex="1"
      overflow="hidden"
    >
      <Tabs.List>
        <Tabs.Trigger value="activities">
          <LuFolder />
          Activities
        </Tabs.Trigger>
        <Tabs.Trigger value="participants">
          <LuUser />
          Participants
        </Tabs.Trigger>
        <Tabs.Trigger value="teams">
          <LuSquareCheck />
          Teams
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.ContentGroup
        flex="1"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "white" },
        }}
      >
        <Tabs.Content value="activities">
          {" "}
          {session ? (
            <HydrateClient>
              <Box>
                {isCreator && <AddActivityButton eventId={eventId} />}
                <ActivityList eventId={eventId} isCreator={isCreator} />
              </Box>
            </HydrateClient>
          ) : (
            <Center pt={12}>Login to View Activities</Center>
          )}
        </Tabs.Content>

        <Tabs.Content value="participants">
          {session ? (
            <ParticipantList participants={participants} />
          ) : (
            <Center pt={12}>Login to View Participants</Center>
          )}
        </Tabs.Content>

        <Tabs.Content value="teams">
          {" "}
          {session ? (
            <Center pt={12}>Teams</Center>
          ) : (
            <Center pt={12}>Login to View Teams</Center>
          )}
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
}
