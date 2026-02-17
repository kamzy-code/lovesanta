"use client";
import { FaPlus } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { AddActivityModal } from "./addActivityModal";
import { Box } from "@chakra-ui/react";

export const AddActivityButton = ({ eventId }: { eventId: string }) => {
  return (
    <Box>
      <Button
        rounded={"lg"}
        p={4}
        position={"absolute"}
        bottom={{ base: "8", md: "8" }}
        right={"4"}
        onClick={async () => {
          await AddActivityModal.open("addActivityForm", { eventId: eventId });
        }}
      >
        <FaPlus />
      </Button>

      <AddActivityModal.Viewport />
    </Box>
  );
};
