"use client";
import { Box, Center, Skeleton, Stack } from "@chakra-ui/react";
import { ActivityCard } from "./activityCard";
import { EditBudgetModal } from "./editBudgetModal";
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
    return (
      <Stack gap={3}>
        <Skeleton h={20} rounded="xl" />
        <Skeleton h={20} rounded="xl" />
      </Stack>
    );
  }
  return (
    <Box>
      {activities.length === 0 ? (
        <Center pt={12} color="fg.muted">
          This event has no activities
        </Center>
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isCreator={isCreator}
          />
        ))
      )}
      {isCreator && <EditBudgetModal.Viewport />}
    </Box>
  );
}
