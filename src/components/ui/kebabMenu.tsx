import { Box, VStack } from "@chakra-ui/react";

export function KebabMenu() {
  return (
    <VStack gap={1}>
      <Box
        display={"flex"}
        rounded={"full"}
        h={1}
        w={1}
        bg={{ base: "gray.700", _dark: "gray.100" }}
      ></Box>
      <Box
        display={"flex"}
        rounded={"full"}
        h={1}
        w={1}
        bg={{ base: "gray.700", _dark: "gray.100" }}
      ></Box>
      <Box
        display={"flex"}
        rounded={"full"}
        h={1}
        w={1}
        bg={{ base: "gray.700", _dark: "gray.100" }}
      ></Box>
    </VStack>
  );
}
