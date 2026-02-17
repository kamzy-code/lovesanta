"use client";

import { Box, Center, Container, Heading } from "@chakra-ui/react";
import { type Activity } from "@prisma/client";
import { api } from "~/trpc/react";
import { ActivityCard } from "./activityCard";
import { GiftingActivity } from "./gifting";

interface ActivityListProps {
  eventId: string;
  isCreator: boolean;
  participantId?: string;
}

export function GiftingActivityList({
  eventId,
  isCreator,
  participantId,
}: ActivityListProps) {
  const {
    data: activities = [],
    error,
    isPending,
  } = api.activity.getEventActivities.useQuery({ eventId });

  if (error) {
    return <Center pt={12}>Error loading activities</Center>;
  }

  if (isPending) {
    return <Center pt={12}>...Loading</Center>;
  }

  return (
    <Container>
      {activities.length === 0 && !isPending ? (
        <Center pt={12}>This event has no activities</Center>
      ) : (
        activities.map((activity) => {
          // Show gifting activity with full interface if participant is enrolled
          if (activity.type === "GIFTING" && participantId) {
            return (
              <Box key={activity.id} mb={6}>
                <GiftingActivity
                  activity={activity}
                  eventId={eventId}
                  participantId={participantId}
                />
              </Box>
            );
          }

          // Show regular activity card for other activities or if not participating
          return (
            <Box key={activity.id}>
              <ActivityCard activity={activity} isCreator={isCreator} />
            </Box>
          );
        })
      )}
    </Container>
  );
}
