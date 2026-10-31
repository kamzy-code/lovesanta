import { Box } from "@chakra-ui/react";
import { staticSecondaryNavItems } from "./data";
import { SecondaryNavigation } from "./secondary-navigation";

/**
 * @component NavbarComponent
 * Full-width tab bar on phones, floating pill on larger screens.
 * The active tab is derived from the current route.
 */
export const NavbarComponent = () => {
  return (
    <Box
      position="fixed"
      zIndex="sticky"
      insetX={0}
      bottom={{ base: 0, md: 6 }}
      display="flex"
      justifyContent="center"
    >
      <SecondaryNavigation items={staticSecondaryNavItems} />
    </Box>
  );
};
