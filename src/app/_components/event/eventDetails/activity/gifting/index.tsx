import { Button, Center, Heading, Stack, Tabs, Text } from "@chakra-ui/react";
import Link from "next/link";
import { WishlistSection } from "./wishlist-section";
import { PairSection } from "./pair-section";
import { MatchHistorySection } from "./match-history-section";
import { ActivityControls } from "./activityControls";
import { GiftingHeader } from "./gifting-header";
import { LuGift, LuHistory, LuList } from "react-icons/lu";
import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { AppBar } from "~/components/ui/app-bar";

interface GiftingActivityProps {
  activityId: string;
}

export async function GiftingActivity({ activityId }: GiftingActivityProps) {
  const session = await auth();
  const activity = await api.activity.getActivityById({ activityId });
  await api.activity.getActivityById.prefetch({ activityId });
  const isCreator = activity.event.creatorId === session?.user.id;
  const { eventId, currentUserParticipantId: participantId } = activity;
  const eventHref = `/event/${activity.event.slug}`;

  if (!participantId) {
    return (
      <Stack gap={6}>
        <AppBar backHref={eventHref} title={activity.event.title} />
        <Center minH="50dvh">
          <Stack gap={4} textAlign="center" maxW="sm" align="center">
            <Heading size="lg">Join the event first</Heading>
            <Text color="fg.muted">
              You need to be a participant in {activity.event.title} to take
              part in the Love Feast.
            </Text>
            <Button size="lg" w="full" asChild>
              <Link href={eventHref}>Go to event</Link>
            </Button>
          </Stack>
        </Center>
      </Stack>
    );
  }

  return (
    <HydrateClient>
      <Stack gap={5} pb={{ md: 12 }}>
        <AppBar backHref={eventHref} title={activity.event.title} />

        <GiftingHeader activityId={activityId} />

        {isCreator && <ActivityControls activityId={activityId} />}

        <Tabs.Root defaultValue="pair" fitted variant="enclosed" lazyMount>
          <Tabs.List
            position="sticky"
            top="calc(3.5rem + env(safe-area-inset-top))"
            zIndex="docked"
            rounded="xl"
          >
            <Tabs.Trigger value="pair" minH={11} rounded="lg">
              <LuGift />
              Pair
            </Tabs.Trigger>
            <Tabs.Trigger value="wishlist" minH={11} rounded="lg">
              <LuList />
              Wishlist
            </Tabs.Trigger>
            <Tabs.Trigger value="history" minH={11} rounded="lg">
              <LuHistory />
              History
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="pair">
            <PairSection
              eventId={eventId}
              participantId={participantId}
              activityId={activity.id}
            />
          </Tabs.Content>

          <Tabs.Content value="wishlist">
            <WishlistSection
              eventId={eventId}
              participantId={participantId}
              activityId={activity.id}
            />
          </Tabs.Content>

          <Tabs.Content value="history">
            <MatchHistorySection
              eventId={eventId}
              participantId={participantId}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </HydrateClient>
  );
}
