"use client";

import { createOverlay } from "@chakra-ui/react";
import { Sheet } from "~/components/ui/sheet";
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
      <Sheet {...rest} title="Edit Event">
        <EditEventForm eventId={eventId!} onClose={handleSubmit} />
      </Sheet>
    );
  },
);
