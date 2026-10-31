"use client";
import { LuPlus } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { AddActivityModal } from "./addActivityModal";

export const AddActivityButton = ({ eventId }: { eventId: string }) => {
  return (
    <>
      <Button
        w="full"
        size="lg"
        variant="outline"
        borderStyle="dashed"
        rounded="xl"
        mb={3}
        onClick={async () => {
          await AddActivityModal.open("addActivityForm", { eventId: eventId });
        }}
      >
        <LuPlus />
        Add activity
      </Button>

      <AddActivityModal.Viewport />
    </>
  );
};
