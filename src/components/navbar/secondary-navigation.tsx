"use client";
import { Box, HStack, Icon, Text, chakra } from "@chakra-ui/react";
import type { SecondaryNavItem } from "./data";
import { useColorMode } from "../ui/color-mode";

import { LuLogOut, LuMoon, LuSun } from "react-icons/lu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";

interface Props {
  items?: SecondaryNavItem[];
}

const TabItem = ({
  icon,
  label,
  active,
}: {
  icon: IconType;
  label: ReactNode;
  active?: boolean;
}) => (
  <HStack
    flexDir={{ base: "column", md: "row" }}
    justify="center"
    gap={{ base: 0.5, md: 2 }}
    minW={{ base: 16, md: "auto" }}
    minH={11}
    px={{ base: 2, md: 3 }}
    rounded="lg"
    color={active ? "fg" : "fg.muted"}
    bg={{ md: active ? { base: "white", _dark: "bg.subtle" } : undefined }}
    transition="color 0.15s, background 0.15s"
  >
    <Icon as={icon} boxSize={{ base: 6, md: 4 }} />
    <Text fontSize={{ base: "2xs", md: "sm" }} fontWeight="medium">
      {label}
    </Text>
  </HStack>
);

const TabButton = chakra("button", {
  base: { cursor: "pointer", flex: { base: 1, md: "initial" } },
});

export const SecondaryNavigation = ({ items = [] }: Props) => {
  const pathname = usePathname();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack
      as="nav"
      w={{ base: "full", md: "auto" }}
      justify="space-around"
      gap={{ base: 0, md: 1 }}
      p={{ base: 1, md: 1 }}
      pb={{ base: "calc(4px + env(safe-area-inset-bottom))", md: 1 }}
      borderTopWidth={{ base: "1px", md: 0 }}
      borderWidth={{ md: "1px" }}
      borderRadius={{ base: 0, md: "lg" }}
      bg={{ base: "bg", md: "bg.muted", _dark: { md: "gray.900" } }}
    >
      {items.map(({ value, path, label, icon }) => (
        <Box asChild key={value} flex={{ base: 1, md: "initial" }}>
          <Link href={path} aria-current={pathname === path ? "page" : undefined}>
            <TabItem icon={icon} label={label} active={pathname === path} />
          </Link>
        </Box>
      ))}

      <TabButton type="button" onClick={toggleColorMode} aria-label="Toggle theme">
        <TabItem
          icon={colorMode === "dark" ? LuSun : LuMoon}
          label={colorMode === "dark" ? "Light" : "Dark"}
        />
      </TabButton>

      <TabButton type="button" onClick={() => void signOut()} aria-label="Logout">
        <TabItem icon={LuLogOut} label="Logout" />
      </TabButton>
    </HStack>
  );
};
