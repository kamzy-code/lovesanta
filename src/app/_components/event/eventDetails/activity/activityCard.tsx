"use client";
import {
  Box,
  Text,
  Badge,
  HStack,
  Icon,
  IconButton,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { type Activity } from "@prisma/client";
import Link from "next/link";
import { FiPlay, FiGift } from "react-icons/fi";
import { LuChevronRight } from "react-icons/lu";
import { KebabMenu } from "~/components/ui/kebabMenu";
import { formatGiftBudget } from "~/lib/common/gifting";
import { api } from "~/trpc/react";
import { EditBudgetModal } from "./editBudgetModal";

interface ActivityProps {
  activity: Activity;
  isCreator: boolean;
}

const ACTIVITY_LABELS: Record<string, string> = {
  GIFTING: "Love Feast",
};

export const STATUS_PALETTE: Record<string, string> = {
  PENDING: "gray",
  ACTIVE: "green",
  PAUSED: "orange",
  COMPLETED: "red",
};

export const ActivityCard = ({ activity, isCreator }: ActivityProps) => {
  const isGifting = activity.type === "GIFTING";
  const budget = isGifting ? formatGiftBudget(activity.settings) : null;
  const utils = api.useUtils();

  const getActivityHref = (activity: Activity): string => {
    const baseMap: Record<string, string> = {
      GIFTING: "activity/gifting",
      // Add other activity types as needed
    };
    const base = baseMap[activity.type] ?? "activity/activity";
    return `/${base}/${activity.id}`;
  };

  const { mutate: deleteActivty } = api.activity.deleteActivity.useMutation({
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
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        utils.activity.getEventActivities.setData(
          { eventId: activity.eventId },
          context.previousData,
        );
      }
      console.error("Failed to delete activity:", error.message);
    },
  });

  const handleDelete = () => {
    deleteActivty({ activityId: activity.id });
  };

  return (
    <HStack
      mb={3}
      gap={0}
      borderWidth="1px"
      rounded="xl"
      bg="bg.panel"
      _hover={{ borderColor: "green.400" }}
      _active={{ bg: "bg.muted" }}
      transition="0.2s"
    >
      <Link href={getActivityHref(activity)} style={{ flex: 1, minWidth: 0 }}>
        <HStack gap={4} p={4} minH={16}>
          <Box
            p={2.5}
            rounded="lg"
            bg={isGifting ? "green.subtle" : "bg.muted"}
            color={isGifting ? "green.fg" : "fg"}
          >
            <Icon as={isGifting ? FiGift : FiPlay} boxSize={5} />
          </Box>
          <Box flex={1} minW={0}>
            <Text fontWeight="bold" truncate>
              {ACTIVITY_LABELS[activity.type] ??
                activity.type.replace("_", " ")}
            </Text>
            <HStack gap={2} mt={1} wrap="wrap">
              <Badge
                variant="subtle"
                colorPalette={STATUS_PALETTE[activity.status] ?? "gray"}
              >
                {activity.status}
              </Badge>
              {budget && (
                <Text fontSize="sm" color="fg.muted">
                  Min. gift {budget}
                </Text>
              )}
            </HStack>
          </Box>
          {!isCreator && <Icon as={LuChevronRight} color="fg.muted" />}
        </HStack>
      </Link>

      {isCreator && (
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <IconButton
              aria-label="Activity options"
              variant="ghost"
              size="lg"
              rounded="full"
              mr={1}
            >
              <KebabMenu />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {isGifting && (
                  <Menu.Item
                    value="edit-budget"
                    py={3}
                    onClick={() =>
                      EditBudgetModal.open(`edit-budget-${activity.id}`, {
                        activityId: activity.id,
                        eventId: activity.eventId,
                        settings: activity.settings,
                      })
                    }
                  >
                    Edit budget
                  </Menu.Item>
                )}
                <Menu.Item
                  value="remove-activity"
                  py={3}
                  color="fg.error"
                  onClick={handleDelete}
                >
                  Remove Activity
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}
    </HStack>
  );
};
