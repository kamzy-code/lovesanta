import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LuChevronLeft } from "react-icons/lu";

interface AppBarProps {
  backHref?: string;
  title?: ReactNode;
  actions?: ReactNode;
}

/**
 * @component AppBar
 * Sticky top bar with a back button, a title and trailing actions
 */
export const AppBar = ({ backHref, title, actions }: AppBarProps) => {
  return (
    <Box
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="bg"
      mx={{ base: -4, md: 0 }}
      px={{ base: 2, md: 0 }}
      pt="env(safe-area-inset-top)"
      borderBottomWidth={{ base: "1px", md: 0 }}
    >
      <HStack h={14} gap={1}>
        {backHref && (
          <Link href={backHref} aria-label="Back">
            <IconButton as="span" variant="ghost" size="lg" rounded="full">
              <LuChevronLeft />
            </IconButton>
          </Link>
        )}
        <Text flex={1} minW={0} truncate fontWeight="semibold" fontSize="lg">
          {title}
        </Text>
        {actions}
      </HStack>
    </Box>
  );
};
