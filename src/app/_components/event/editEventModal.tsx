"use client";

import {
  Dialog,
  Portal,
  Stack,
  createOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { EditEventForm } from "./editEventForm";

interface EditEventModalProps {
  eventId?: string;
}

export const EditEventModal = createOverlay<EditEventModalProps>(
  (props) => {
    const { eventId, ...rest } = props;

    const handleSubmit = () => {
      // Close dialog using injected `onOpenChange` prop
      props.onOpenChange?.({ open: false });
    };

    return (
      <Dialog.Root {...rest}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content top={50} mx={12}>
              <Dialog.Header alignItems={"center"} justifyContent={"center"}>
                <Dialog.Title fontFamily={"Alliance"}>
                  Edit Event
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Stack>
                  <EditEventForm eventId={eventId!} onClose={handleSubmit} />
                </Stack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  },
);
