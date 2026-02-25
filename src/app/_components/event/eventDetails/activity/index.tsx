"use client";
import { Box, Center, Container } from "@chakra-ui/react";
import { ActivityCard } from "./activityCard";
import { api } from "~/trpc/react";

interface ActivityListProps {
  eventId: string;
  isCreator: boolean;
}

export function ActivityList({ eventId, isCreator }: ActivityListProps) {
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
