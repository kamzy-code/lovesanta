import { Container, Tabs, } from "@chakra-ui/react";
import { WishlistSection } from "./wishlist-section";
import { PairSection } from "./pair-section";
import { MatchHistorySection } from "./match-history-section";
import { LuGift, LuHistory, LuList } from "react-icons/lu";
import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";

interface GiftingActivityProps {
  activityId: string;
}

export async function GiftingActivity({ activityId }: GiftingActivityProps) {
  const session = await auth();
  const activity = await api.activity.getActivityById({ activityId });
  const isCreator = activity.event.creatorId === session?.user.id;
  const { eventId, currentUserParticipantId: participantId } = activity;

  return (
    <Container maxW="5xl" py={12}>
      <HydrateClient>
        <Tabs.Root
          defaultValue="pair"
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <Tabs.List>
            <Tabs.Trigger value="pair">
              <LuGift />
              My Pair
            </Tabs.Trigger>
            <Tabs.Trigger value="wishlist">
              <LuList />
              My Wishlist
            </Tabs.Trigger>
            <Tabs.Trigger value="history">
              <LuHistory />
              History
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.ContentGroup
            flexDirection="column"
            gap={6}
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "white" },
            }}
          >
            <Tabs.Content value="wishlist">
              <WishlistSection
                eventId={eventId}
                participantId={participantId!}
              />
            </Tabs.Content>

            <Tabs.Content value="pair">
              <PairSection
                eventId={eventId}
                participantId={participantId!}
                activityId={activity.id}
                isCreator={isCreator}
              />
            </Tabs.Content>

            <Tabs.Content value="history">
              <MatchHistorySection
                eventId={eventId}
                participantId={participantId!}
              />
            </Tabs.Content>
          </Tabs.ContentGroup>
        </Tabs.Root>
      </HydrateClient>
    </Container>
  );
}
