"use client";
import { Box, Center, Container } from "@chakra-ui/react";

import { ActivityCard } from "./activityCard";
import { type Activity } from "@prisma/client";
import { api } from "~/trpc/react";
import Link from "next/link";

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

  const getActivityHref = (activity: Activity): string => {
    const baseMap: Record<string, string> = {
      GIFTING: "activity/gifting",
      // Add other activity types as needed
    };
    const base = baseMap[activity.type] ?? "activity/activity";
    return `/${base}/${activity.id}`;
  };

  if (isPending){
    return <Center pt={12}>...Loading</Center>;
  }
  return (
    <Container>
      {(activities.length === 0 && !isPending) ? (
        <Center pt={12}>This event has no activities</Center>
      ) : (
        activities.map((activity) => {
          return (

            <Box key={activity.id}>
              <Link href={getActivityHref(activity)}>
              <ActivityCard activity={activity} isCreator={isCreator} />
              </Link>
            </Box>
          );
        })
      )}
    </Container>
  );
}
