"use client";

import { useState } from "react";
import {
  Box,
  Card,
  Stack,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Heading,
  Span,
  Center,
  Spacer,
} from "@chakra-ui/react";
import { toaster } from "~/components/ui/toaster";
import { type ActivityStatus } from "@prisma/client";
import { api } from "~/trpc/react";
import { LuRefreshCw, LuLoader, LuGift, LuCircleAlert } from "react-icons/lu";
import { Avatar } from "~/components/ui/avatar";
import { RetryIndicator } from "~/components/display/retry-indicator";
import { PairPreferenceDrawer } from "~/components/display/preference-drawer";
import { ConfettiComponent } from "~/components/display/confetti";
import { ActivityControls } from "./activityControls";

interface PairSectionProps {
  eventId: string;
  participantId: string;
  activityId: string;
  isCreator: boolean;
}

export function PairSection({
  eventId,
  participantId,
  activityId,
  isCreator,
}: PairSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = toaster.create;
  const utils = api.useUtils();

  // Fetch activity status to ensure it updates when changed
  const { data: activityData } = api.activity.getActivityById.useQuery({
    activityId,
  });

  const activityStatus = activityData?.status ?? "PENDING";

  // Fetch current match and history
  const { data: matchData, isLoading } = api.gifting.getCurrentMatch.useQuery({
    participantId,
    activityId,
    eventId,
  });

  const { mutate: generatePair, isPending: isGenerating } =
    api.gifting.generateMatch.useMutation({
      onSuccess: async () => {
        await utils.gifting.getCurrentMatch.invalidate({
          participantId,
          activityId,
          eventId,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          type: "error",
          duration: 3000,
        });
      },
    });

  const handleOpenDrawer = () => {
    if (matchData?.attemptsRemaining === 0) {
      toast({
        title: "No Attempts Left",
        description: "You've used all your pair regenerations",
        type: "error",
        duration: 3000,
      });
      return;
    }
    setDrawerOpen(true);
  };

  const isActivityActive = activityStatus === "ACTIVE";
  const hasMatch = matchData?.match;
  const attemptsRemaining = matchData?.attemptsRemaining ?? 3;

  if (isLoading) {
    return (
      <Card.Root>
        <Card.Body>
          <HStack justify="center" py={12}>
            <LuLoader className="animate-spin" />
            <Text>Loading your pair information...</Text>
          </HStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (!isActivityActive && !hasMatch) {
    return (
      <Card.Root>
        <Card.Body>
          <VStack gap={4} align="center" py={8}>
            <Box as={LuCircleAlert} fontSize="2xl" />
            <Heading size="md">Activity Not Started</Heading>
            <Text color="fg.muted" textAlign="center">
              The gifting activity hasn&apos;t started yet. Please wait for the
              event organizer to begin the activity.
            </Text>
            {isCreator && (
              <ActivityControls
                activityId={activityId}
                activityStatus={activityStatus}
              />
            )}
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (!hasMatch) {
    return (
      <Card.Root>
        <Card.Body>
            {isCreator && (
            <ActivityControls
              activityId={activityId}
              activityStatus={activityStatus}
            />
          )}

          <VStack gap={16} align="stretch" py={12}>
            <VStack gap={3} align="center">
              <Box as={LuGift} fontSize="2xl" />
              <Heading size="md">No Pair Yet</Heading>
              <Text color="fg.muted" textAlign="center">
                Generate your pair to see who you&apos;ll be buying a gift for!
              </Text>
            </VStack>

            <Center>
              <Box animation={"pulse 6s infinite"}>
                <Button
                  w="100px"
                  h="100px"
                  loading={isGenerating}
                  borderRadius="full"
                  data-state="open"
                  bg="green.700"
                  boxShadow="0 0 100px #008f0050, 0 0 20px #008f0010, 0 0 30px #20802040, 0 0 40px #008f00, 0 0 50px #208020, 0 0 60px #008f00, 0 0 70px #208020"
                  color="white"
                  _hover={{ bg: "green.600" }}
                  onClick={() => {
                    void generatePair({
                      participantId,
                      activityId,
                      eventId,
                    });
                  }}
                  disabled={isGenerating}
                >
                  GENERATE
                </Button>
              </Box>
            </Center>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  const receiver = matchData?.match?.receiver;

  return (
    <Stack gap={4}>
      {/* Activity Controls - Creator Only */}
      {isCreator && (
        <ActivityControls
          activityId={activityId}
          activityStatus={activityStatus}
        />
      )}

      {/* Match Card */}

      <ConfettiComponent show={true} />
      <Card.Root bg="bg.muted" variant="elevated" boxShadow="lg">
        <Card.Header pb={0}>
          <Card.Title>Your Secret Match</Card.Title>
        </Card.Header>
        <Card.Body>
          <VStack gap={6} align="stretch">
            {/* Receiver Info */}
            <HStack gap={4} p={4} bg="bg.panel" rounded="lg">
              <Avatar
                name={receiver?.user?.firstName as string}
                src={receiver?.user?.image as string}
                size="lg"
              />
              <VStack align="flex-start" gap={1} flex={1}>
                <Heading size="md">
                  {receiver?.user?.username || "Secret Person"}
                </Heading>
                {/* <Badge colorScheme="green" variant="subtle">
                  {"Unknown Region"}
                </Badge> */}
                {/* <Text fontSize="sm" color="fg.muted">
                  {receiver?.user?.email}
                </Text> */}
              </VStack>
            </HStack>

            {/* Wishlist */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Their Wishlist
              </Text>
              <Box
                p={4}
                bg="bg.panel"
                rounded="lg"
                borderLeftWidth={4}
                borderColor="green.500"
              >
                <Text fontSize="md" lineHeight="tall" whiteSpace="pre-wrap">
                  {receiver?.wishlist || "No wishlist provided yet"}
                </Text>
              </Box>
            </Box>

            {/* Attempts Indicator */}
            <RetryIndicator count={3 - attemptsRemaining} />

            {/*Rules */}
            <VStack
              divideY={"1px"}
              gap="2"
              align={"flex-start"}
              textAlign="left"
              fontSize={"lg"}
            >
              <HStack
                fontWeight="medium"
                w={"full"}
                bg="bg.muted"
                gap="0"
                rounded="lg"
                px="3"
                py="1"
                spaceX={3}
                align={"flex-start"}
              >
                <Span color="fg.muted">1/</Span>
                <Span>You can only generate a new pair thrice (3 times)</Span>
              </HStack>
              <HStack
                fontWeight="medium"
                w={"full"}
                bg="bg.muted"
                gap="0"
                rounded="lg"
                px="3"
                py="1"
                spaceX={3}
                align={"flex-start"}
              >
                <Span color="fg.muted">2/</Span>
                <Span>
                  If you don&apos;t like your match, generate a new one
                </Span>
              </HStack>
              <HStack
                fontWeight="medium"
                bg="bg.muted"
                gap="0"
                rounded="lg"
                px="3"
                py="1"
                spaceX={3}
                align={"flex-start"}
              >
                <Span color="fg.muted">3/</Span>
                <Span>Viewing your match might cost you a count</Span>
              </HStack>
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Action Buttons */}
      {isActivityActive && (
        <HStack gap={3} justify="space-between">
          <Button
            flex={1}
            variant="outline"
            onClick={handleOpenDrawer}
            disabled={attemptsRemaining === 0}
          >
            {isGenerating ? (
              <>
                <LuLoader className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <LuRefreshCw />
                {attemptsRemaining > 0
                  ? `Dont' like this pair? Generate a new pair (${attemptsRemaining} left)`
                  : "No Attempts Left"}
              </>
            )}
          </Button>
        </HStack>
      )}

      {!isActivityActive && (
        <Text color="fg.muted" textAlign="center" fontStyle="italic">
          The activity is no longer active. Please wait for the organizer to
          restart the activity to change your pair.
        </Text>
      )}

      {/* Pair Selection Drawer */}
      <PairPreferenceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        participantId={participantId}
        eventId={eventId}
        activityId={activityId}
        receiver={matchData?.match?.receiver}
        attemptsRemaining={attemptsRemaining}
      />
    </Stack>
  );
}
