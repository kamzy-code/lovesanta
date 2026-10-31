import { Box, Center, Tabs } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { type ParticipantWithUser } from "~/types";
import { ParticipantList } from "./particpant";
import { auth } from "~/server/auth";
import { ActivityList } from "./activity";
import { AddActivityButton } from "./activity/addActivityButton";
import { api, HydrateClient } from "~/trpc/server";

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

  if (session) {
    await api.activity.getEventActivities.prefetch({
      eventId,
    });
  }

  return (
    <Tabs.Root defaultValue="activities" fitted variant="line">
      <Tabs.List
        position="sticky"
        // sits under the sticky AppBar (h=14 + safe area)
        top="calc(3.5rem + env(safe-area-inset-top))"
        zIndex="docked"
        bg="bg"
      >
        <Tabs.Trigger value="activities" minH={12}>
          <LuFolder />
          Activities
        </Tabs.Trigger>
        <Tabs.Trigger value="participants" minH={12}>
          <LuUser />
          People
        </Tabs.Trigger>
        <Tabs.Trigger value="teams" minH={12}>
          <LuSquareCheck />
          Teams
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="activities">
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
        {session ? (
          <Center pt={12} color="fg.muted">
            Teams are coming soon
          </Center>
        ) : (
          <Center pt={12}>Login to View Teams</Center>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}
