"use client";
import { Menu, Portal } from "@chakra-ui/react";
import { Button } from "~/components/ui/button";
import { KebabMenu } from "~/components/ui/kebabMenu";
import { toaster } from "~/components/ui/toaster";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

interface EventKebabMenuProps {
  isCreator: boolean;
  eventId: string;
}

export function EventKebabMenu({ isCreator, eventId }: EventKebabMenuProps) {
  const toast = toaster.create;
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate: deleteEvent, isPending: isDeleting } =
    api.event.deleteEvent.useMutation({
      onError: (error) => {
        console.error("Failed to delete event", error);
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          type: "error",
          duration: 3000,
        });
      },
      onSuccess: async () => {
        await utils.event.fetchAlEvents.invalidate();
        // navigate to home or show a success message
        router.push("/home");
      },
    });

  const { mutate: leaveEvent, isPending: isLeaving } =
    api.event.leaveEvent.useMutation({
      onError: (error) => {
        console.error("Failed to leave event", error);
        toast({
          title: "Error",
          description: "Failed to leave event. Please try again.",
          type: "error",
          duration: 3000,
        });
      },
      onSuccess: async () => {
        await utils.event.fetchAlEvents.invalidate();
        // navigate to home or show a success message
        router.push("/home");
      },
    });

  const handleDelete = () => {
    deleteEvent({ eventId });
  };

  const handleLeave = () => {
    leaveEvent({ eventId });
  };
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm">
          <KebabMenu />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {!isCreator && (
              <Menu.Item value="leave-event" onClick={() => handleLeave()}>
                Leave Event
              </Menu.Item>
            )}

            {isCreator && (
              <Menu.Item value="delete-event" onClick={() => handleDelete()}>
                Delete Event
              </Menu.Item>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
