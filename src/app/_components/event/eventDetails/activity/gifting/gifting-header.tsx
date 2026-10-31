"use client";

import { Badge, HStack, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { LuWallet } from "react-icons/lu";
import { formatGiftBudget } from "~/lib/common/gifting";
import { api } from "~/trpc/react";
import { STATUS_PALETTE } from "../activityCard";

export function useGiftingActivity(activityId: string) {
  return api.activity.getActivityById.useQuery({ activityId });
}

export function GiftingHeader({ activityId }: { activityId: string }) {
  const { data: activity } = useGiftingActivity(activityId);
  const status = activity?.status ?? "PENDING";
  const budget = formatGiftBudget(activity?.settings);

  return (
    <Stack gap={3}>
      <HStack justify="space-between" align="center" gap={3}>
        <Heading size={{ base: "2xl", md: "3xl" }}>
          Love Feast
        </Heading>
        <Badge
          size="lg"
          variant="subtle"
          colorPalette={STATUS_PALETTE[status] ?? "gray"}
        >
          {status}
        </Badge>
      </HStack>
      {budget && <BudgetCallout budget={budget} />}
    </Stack>
  );
}

export function BudgetCallout({ budget }: { budget: string }) {
  return (
    <HStack
      gap={3}
      p={3}
      rounded="xl"
      bg="green.subtle"
      color="green.fg"
      borderWidth="1px"
      borderColor="green.muted"
    >
      <Icon as={LuWallet} boxSize={5} />
      <Text fontSize="sm">
        Minimum gift budget{" "}
        <Text as="span" fontWeight="bold" fontSize="md">
          {budget}
        </Text>
      </Text>
    </HStack>
  );
}
