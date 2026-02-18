"use client";
import { HStack, Icon, Text } from "@chakra-ui/react";
import { LuCircleDot, LuCircleCheck } from "react-icons/lu";
import { useColorModeValue } from "~/components/ui/color-mode";

export const RetryIndicator = ({ count = 3 }) => {
  const theme = useColorModeValue("light", "dark");

  return (
    <HStack position={"relative"} justify="space-between" px={6} py={2}>
      <HStack position={"relative"} flexFlow={"row-reverse"}>
        {[...Array(3)].map((_, index) => (
          <Icon key={index} color={index < 3 - count ? `${theme === "dark" ? "gray.100" : "gray.800"}` : "red.500"}>
            {index < 3 - count ? <LuCircleDot /> : <LuCircleCheck />}
          </Icon>
        ))}
      </HStack>
      <Text
        fontSize={"sm"}
        color={theme === "dark" ? "gray.100" : "gray.800"}
        alignSelf={"flex-end"}
        textAlign={"right"}
      >
        You have {Number(3 - count)} remaining tries
      </Text>
    </HStack>
  );
};
