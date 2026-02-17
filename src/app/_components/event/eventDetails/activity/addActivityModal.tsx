"use client";

import {
  AbsoluteCenter,
  Button,
  Dialog,
  Heading,
  Input,
  Portal,
  Stack,
  createOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddActivityForm } from "./addActivityForm";

interface AddActivityModalProps {
  eventId?: string;
}

export const AddActivityModal = createOverlay<AddActivityModalProps>(
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
                  Add New Activity
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Stack>
                  <AddActivityForm eventId={eventId!} onclose={handleSubmit} />
                </Stack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  },
);
