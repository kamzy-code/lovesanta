"use client";
import {
  Box,
  Text,
  Badge,
  Button,
  HStack,
  Icon,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { type Activity } from "@prisma/client";
import Link from "next/link";
import { FiPlay, FiGift, } from "react-icons/fi";
import { KebabMenu } from "~/components/ui/kebabMenu";
import { api } from "~/trpc/react";

interface ActivityProps {
  activity: Activity;
  isCreator: boolean;
}
export const ActivityCard = ({ activity, isCreator }: ActivityProps) => {
  const isGifting = activity.type === "GIFTING";
  const utils = api.useUtils();

  const getActivityHref = (activity: Activity): string => {
    const baseMap: Record<string, string> = {
      GIFTING: "activity/gifting",
      // Add other activity types as needed
    };
    const base = baseMap[activity.type] ?? "activity/activity";
    return `/${base}/${activity.id}`;
  };

  const { mutate: deleteActivty, isPending: isDeleting } =
    api.activity.deleteActivity.useMutation({
      onMutate: async ({ activityId }) => {
        // Cancel ongoing queries to prevent overwriting optimistic update
        await utils.activity.getEventActivities.cancel({
          eventId: activity.eventId,
        });

        // Get previous data for potential rollback
        const previousData = utils.activity.getEventActivities.getData({
          eventId: activity.eventId,
        });

        // Optimistically remove the activity from cache
        utils.activity.getEventActivities.setData(
          { eventId: activity.eventId },
          (data) => data?.filter((a) => a.id !== activityId) || [],
        );

        return { previousData };
      },
      onSuccess: async () => {
        // Handle success - maybe show a toast or refresh data
      },
      onError: (error, variables, context) => {
        // Rollback on error
        if (context?.previousData) {
          utils.activity.getEventActivities.setData(
            { eventId: activity.eventId },
            context.previousData,
          );
        }
        // Handle error - show error message
        console.error("Failed to delet activity:", error.message);
      },
    });

  const handleDelete = () => {
    deleteActivty({ activityId: activity.id });
  };

  return (
    <Box
      border="1px solid black"
      mb={3}
      _hover={{ borderColor: "green.400" }}
      transition="0.2s"
    >
      <HStack justify="space-between">
        <Link href={getActivityHref(activity)} style={{ flex: 1}}>
          <HStack gap={4}   p={4}>
            <Icon as={isGifting ? FiGift : FiPlay} boxSize={5} />
            <Box>
              <Text fontWeight="bold" textTransform="uppercase">
                {activity.type.replace("_", " ")}
              </Text>
              <Badge
                variant="outline"
                colorScheme={activity.status === "ACTIVE" ? "green" : "gray"}
              >
                {activity.status}
              </Badge>
            </Box>
          </HStack>
        </Link>

        <HStack onClick={(e) => e.stopPropagation()}>
          {isCreator && (
            <Menu.Root>
              <Menu.Trigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <KebabMenu />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="remove-activity" onClick={handleDelete}>
                      Remove Activity
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};
