"use client";

import { Center, Float, Stack, Text } from "@chakra-ui/react";
import React from "react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { FiChevronRight } from "react-icons/fi";
import { type Participant, type User } from "@prisma/client";
import { api } from "~/trpc/react";
import { Toaster, toaster } from "../ui/toaster";

type GiftingDrawerConfig = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string;
  eventId: string;
  activityId: string;
  receiver?: Participant & { user?: Pick<User, "firstName" | "id" | "image" | "email"> };
  attemptsRemaining: number;
};

export function PairPreferenceDrawer({
  open,
  onOpenChange,
  participantId,
  eventId,
  activityId,
  receiver,
  attemptsRemaining,
}: GiftingDrawerConfig) {

  const utils = api.useUtils();
  const toast = toaster.create;

  const generateMatchMutation = api.gifting.generateMatch.useMutation({
    onSuccess: async () => {
      await utils.gifting.getCurrentMatch.invalidate({
        participantId,
        eventId,
        activityId,
      });
      onOpenChange(false);
      toast({
        title: "Success",
        description: "New pair generated!",
        type: "success",
        duration: 3000,
      });
    },
    onError: async (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });

  const giverName = "You";
  const receiverName = receiver?.user?.firstName || "Secret Person";

  return (
    <DrawerRoot
      placement={"bottom"}
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      size={"xl"}
    >
      <DrawerBackdrop />
      <DrawerContent minH={"50vh"} pt={12} borderTopRadius={"3xl"}>
        <DrawerCloseTrigger />

        <Toaster />
        <Center rotate={"8"} ml={"-24"} py={8} fontFamily={"Pixeboy"}>
          <Avatar
            name={giverName}
            color={'gray.100'}
            borderRadius={"xl"}
            rotate={"-16"}
            w={"32"}
            h={"32"}
            size={"full"}
            bg="linear-gradient(40deg, #81f242, red, black)"
            borderColor="blackAlpha.50"
            css={{
              "--avatar-size": "sizes.32",
              "--avatar-font-size": "fontSizes.3xl",
            }}
          >
            <span>.</span>
            <Float offset="-8" placement="middle-end" boxSize="24" top={20}>
              <Avatar
                rotate={"28"}
                color={'gray.100'}
                borderRadius={"xl"}
                bg="linear-gradient(40deg, black, purple, #81f242)"
                w={"32"}
                h={"32"}
                size={"full"}
                name={receiverName}
              >
                <span>.</span>
              </Avatar>
            </Float>
          </Avatar>
        </Center>

        <DrawerHeader
          maxW={"md"}
          mx={"auto"}
          textTransform={"capitalize"}
          fontFamily={"Blimone"}
        >
          <DrawerTitle fontSize={"lg"}>
            {giverName} & {receiverName}
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody
          textAlign={"center"}
          mb={0}
          pb={0}
          fontSize={"sm"}
          maxW={"4xl"}
          mx={"auto"}
        >
          <Text maxW={"xs"}>
            {`Hi! You've been assigned to gift `}
            <strong>{receiverName} 🎁</strong> {`. If you'd like a different match,
            you can generate a new pair below. You have `}
            <strong>{attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""}</strong>{" "}
            remaining.
          </Text>

          <Stack mt={10}>
            <Button
              mt={4}
              ring={"1px"}
              disabled={attemptsRemaining === 0}
              aria-disabled={attemptsRemaining === 0}
              ringColor={"bg.subtle"}
              boxShadow={"lg"}
              variant="subtle"
              size="md"
              rounded={"l3"}
              loading={generateMatchMutation.isPending}
              onClick={async () => {
                void generateMatchMutation.mutate({
                  participantId,
                  activityId,
                  eventId,
                });
              }}
            >
              Generate a new pair <FiChevronRight />
            </Button>
          </Stack>
        </DrawerBody>
        <DrawerFooter />
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
}
