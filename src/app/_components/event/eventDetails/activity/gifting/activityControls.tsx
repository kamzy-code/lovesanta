"use client";
import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuPause, LuPlay, LuRotateCcw, LuSquare, LuWallet } from "react-icons/lu";
import { api } from "~/trpc/react";
import { toaster } from "~/components/ui/toaster";
import { Sheet } from "~/components/ui/sheet";
import { EditBudgetModal } from "../editBudgetModal";
import { useGiftingActivity } from "./gifting-header";

interface ActivityControlsProps {
  activityId: string;
}

const STATUS_HINT: Record<string, string> = {
  PENDING: "Start the activity to let everyone generate their pair.",
  ACTIVE: "Pairing is open. Pause to stop new pairs while people keep joining.",
  PAUSED:
    "Pairing is paused. People can still join and update wishlists. Resume when you're ready.",
  COMPLETED: "This activity has ended and the event is closed to new people.",
};

export function ActivityControls({ activityId }: ActivityControlsProps) {
  const toast = toaster.create;
  const utils = api.useUtils();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const { data: activity } = useGiftingActivity(activityId);
  const activityStatus = activity?.status ?? "PENDING";

  const mutationOptions = (description: string) => ({
    onSuccess: async () => {
      await utils.activity.getActivityById.invalidate({ activityId });
      setConfirmEnd(false);
      toast({
        title: "Success",
        description,
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: { message: string }) => {
      toast({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });

  const start = api.activity.startActivity.useMutation(
    mutationOptions("Activity started!"),
  );
  const pause = api.activity.pauseActivity.useMutation(
    mutationOptions("Pairing paused"),
  );
  const resume = api.activity.resumeActivity.useMutation(
    mutationOptions("Pairing resumed!"),
  );
  const end = api.activity.endActivity.useMutation(
    mutationOptions("Activity completed!"),
  );

  const isBusy =
    start.isPending || pause.isPending || resume.isPending || end.isPending;

  return (
    <Stack gap={3} p={4} rounded="xl" borderWidth="1px" bg="bg.panel">
      <HStack justify="space-between">
        <Text fontWeight="semibold">Organiser controls</Text>
        {activity && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              EditBudgetModal.open(`edit-budget-${activityId}`, {
                activityId,
                eventId: activity.eventId,
                settings: activity.settings,
              })
            }
          >
            <LuWallet />
            Edit budget
          </Button>
        )}
      </HStack>

      <Text fontSize="sm" color="fg.muted">
        {STATUS_HINT[activityStatus]}
        {activityStatus !== "PENDING" && activity
          ? ` ${activity.unmatchedCount} of ${activity.event.participants.length} still need a pair.`
          : ""}
      </Text>

      <HStack gap={3} css={{ "& > button": { flex: 1 } }}>
        {(activityStatus === "PENDING" || activityStatus === "COMPLETED") && (
          <Button
            size="lg"
            colorPalette="green"
            onClick={() => start.mutate({ activityId })}
            loading={start.isPending}
            disabled={isBusy}
          >
            {activityStatus === "PENDING" ? <LuPlay /> : <LuRotateCcw />}
            {activityStatus === "PENDING" ? "Start" : "Restart"}
          </Button>
        )}
        {activityStatus === "ACTIVE" && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => pause.mutate({ activityId })}
            loading={pause.isPending}
            disabled={isBusy}
          >
            <LuPause />
            Pause pairing
          </Button>
        )}
        {activityStatus === "PAUSED" && (
          <Button
            size="lg"
            colorPalette="green"
            onClick={() => resume.mutate({ activityId })}
            loading={resume.isPending}
            disabled={isBusy}
          >
            <LuPlay />
            Resume
          </Button>
        )}
        {(activityStatus === "ACTIVE" || activityStatus === "PAUSED") && (
          <Button
            size="lg"
            variant="subtle"
            colorPalette="red"
            onClick={() => setConfirmEnd(true)}
            disabled={isBusy}
          >
            <LuSquare />
            End
          </Button>
        )}
      </HStack>

      <Sheet
        open={confirmEnd}
        onOpenChange={(e) => setConfirmEnd(e.open)}
        title="End this activity?"
        description="Pairing stops for good and nobody new can join the event. Use Pause instead if more people are still coming."
        footer={
          <>
            <Button
              size="lg"
              w={{ base: "full", md: "auto" }}
              variant="outline"
              onClick={() => setConfirmEnd(false)}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              w={{ base: "full", md: "auto" }}
              colorPalette="red"
              loading={end.isPending}
              onClick={() => end.mutate({ activityId })}
            >
              End activity
            </Button>
          </>
        }
      />
      <EditBudgetModal.Viewport />
    </Stack>
  );
}
