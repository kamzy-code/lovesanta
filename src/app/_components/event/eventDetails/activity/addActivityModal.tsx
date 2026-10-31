"use client";

import { createOverlay } from "@chakra-ui/react";
import { Sheet } from "~/components/ui/sheet";
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
      <Sheet {...rest} title="Add New Activity">
        <AddActivityForm eventId={eventId!} onclose={handleSubmit} />
      </Sheet>
    );
  },
);
