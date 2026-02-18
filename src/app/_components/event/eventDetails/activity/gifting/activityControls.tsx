'use client'
import { Box, HStack, Toast } from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { toaster, Toaster } from "~/components/ui/toaster";

interface ActivityControlsProps {
  activityId: string;
  activityStatus: string;
}

export function ActivityControls({ activityId, activityStatus }: ActivityControlsProps) {
    const toast = toaster.create;
    const utils = api.useUtils();
    const { mutate: startActivity, isPending: isStarting } =
        api.activity.startActivity.useMutation({
          onSuccess: async () => {
            await utils.activity.getActivityById.invalidate({
              activityId,
            });
            toast({
              title: "Success",
              description: "Activity started!",
              type: "success",
              duration: 3000,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
              type: "error",
              duration: 3000,
            });
          },
        });
    
      const { mutate: endActivity, isPending: isEnding } =
        api.activity.endActivity.useMutation({
          onSuccess: async () => {
            await utils.activity.getActivityById.invalidate({
              activityId,
            });
            toast({
              title: "Success",
              description: "Activity completed!",
              type: "success",
              duration: 3000,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
              type: "error",
              duration: 3000,
            });
          },
        });

  return (
    <Box>
        <Toaster />
      {/* Activity Controls - Creator Only */}
      {
        <HStack justify="flex-end" gap={2}>
          {activityStatus === "PENDING" && (
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => startActivity({ activityId })}
              loading={isStarting}
            >
              Start Activity
            </Button>
          )}
          {activityStatus === "ACTIVE" && (
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => endActivity({ activityId })}
              loading={isEnding}
            >
              End Activity
            </Button>
          )}
          {activityStatus === "COMPLETED" && (
            <HStack gap={1} align="center">
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => startActivity({ activityId })}
                loading={isStarting}
              >
                Restart Activity
              </Button>
            </HStack>
          )}
        </HStack>
      }
    </Box>
  );
}
