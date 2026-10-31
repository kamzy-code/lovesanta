import { Box, HStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

/**
 * @component ActionBar
 * Pins the screen's primary actions to the bottom of the viewport on phones,
 * thumb-reachable and above the home indicator. Renders inline on desktop.
 */
export const ActionBar = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      position={{ base: "fixed", md: "static" }}
      insetX={0}
      bottom={0}
      zIndex="docked"
      bg={{ base: "bg", md: "transparent" }}
      borderTopWidth={{ base: "1px", md: 0 }}
      px={{ base: 4, md: 0 }}
      pt={{ base: 3, md: 0 }}
      pb={{ base: "calc(12px + env(safe-area-inset-bottom))", md: 0 }}
    >
      {/* full-width row on phones; shrinks to its buttons on desktop */}
      <HStack
        gap={3}
        w={{ base: "full", md: "fit-content" }}
        css={{ "& > *": { flex: 1 } }}
      >
        {children}
      </HStack>
    </Box>
  );
};
