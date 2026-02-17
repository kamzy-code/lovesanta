"use client";

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
  Spacer,
  Span,
  Container,
  Center,
} from "@chakra-ui/react";
import { toaster } from "~/components/ui/toaster";
import { type ActivityStatus } from "@prisma/client";
import { api } from "~/trpc/react";
import {
  LuRefreshCw,
  LuLoader,
  LuGift,
  LuCircleAlert,
  LuEye,
} from "react-icons/lu";
import { Avatar } from "~/components/ui/avatar";
import { RetryIndicator } from "~/app/_components/event-pair/retry-indicator";
import { Suspense } from "react";
import PairPreferenceDrawer from "~/components/display/preference-drawer";
import { PreviousConnections } from "~/app/_components/event-pair/previous-connections";
import { ConfettiComponent } from "~/components/display/confetti";

interface PairSectionProps {
  eventId: string;
  participantId: string;
  activityId: string;
  activityStatus: ActivityStatus;
}

export function PairSection({
  eventId,
  participantId,
  activityId,
  activityStatus,
}: PairSectionProps) {
  const toast = toaster.create;
  const utils = api.useUtils();

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

  const handleGeneratePair = () => {
    if (matchData?.attemptsRemaining === 0) {
      toast({
        title: "No Attempts Left",
        description: "You've used all your pair regenerations",
        type: "error",
        duration: 3000,
      });
      return;
    }
    generatePair({
      participantId,
      activityId,
      eventId,
    });
  };

  const isActivityActive = true; //activityStatus === "ACTIVE";
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

  if (!isActivityActive) {
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
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (!hasMatch) {
    return (
      <Card.Root>
        <Card.Body>
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
                  onClick={handleGeneratePair}
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
      <HStack gap={3} justify="space-between">
        <Button
          flex={1}
          variant="outline"
          onClick={handleGeneratePair}
          disabled={isGenerating || attemptsRemaining === 0}
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
    </Stack>
  );
}
