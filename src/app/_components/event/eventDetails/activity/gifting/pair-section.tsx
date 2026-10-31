"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Card,
  Stack,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Span,
  Center,
  Skeleton,
} from "@chakra-ui/react";
import { toaster } from "~/components/ui/toaster";
import { api } from "~/trpc/react";
import {
  LuRefreshCw,
  LuGift,
  LuCircleAlert,
  LuPause,
  LuWallet,
} from "react-icons/lu";
import { Avatar } from "~/components/ui/avatar";
import { RetryIndicator } from "~/components/display/retry-indicator";
import { PairPreferenceDrawer } from "~/components/display/preference-drawer";
import { ConfettiComponent } from "~/components/display/confetti";
import { ActionBar } from "~/components/ui/action-bar";
import { formatGiftBudget } from "~/lib/common/gifting";
import { useGiftingActivity } from "./gifting-header";

interface PairSectionProps {
  eventId: string;
  participantId: string;
  activityId: string;
}

const RULES = [
  "You can only generate a new pair thrice (3 times)",
  "If you don't like your match, generate a new one",
  "Viewing your match might cost you a count",
];

const StatusCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <Card.Root>
    <Card.Body>
      <VStack gap={3} align="center" py={8} textAlign="center">
        <Box as={icon} fontSize="2xl" color="fg.muted" />
        <Heading size="md">{title}</Heading>
        <Text color="fg.muted" maxW="sm">
          {children}
        </Text>
      </VStack>
    </Card.Body>
  </Card.Root>
);

export function PairSection({
  eventId,
  participantId,
  activityId,
}: PairSectionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [celebrations, setCelebrations] = useState(0);
  const toast = toaster.create;
  const utils = api.useUtils();

  const { data: activityData } = useGiftingActivity(activityId);
  const activityStatus = activityData?.status ?? "PENDING";
  const budget = formatGiftBudget(activityData?.settings);

  // Fetch current match and history
  const { data: matchData, isLoading } = api.gifting.getCurrentMatch.useQuery({
    participantId,
    activityId,
    eventId,
  });

  const onGenerated = async () => {
    setCelebrations((n) => n + 1);
    await Promise.all([
      utils.gifting.getCurrentMatch.invalidate({
        participantId,
        activityId,
        eventId,
      }),
      utils.gifting.getMatchHistory.invalidate({ participantId, eventId }),
    ]);
  };

  const { mutate: generatePair, isPending: isGenerating } =
    api.gifting.generateMatch.useMutation({
      onSuccess: onGenerated,
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
  const isPaused = activityStatus === "PAUSED";
  const hasMatch = matchData?.match;
  const attemptsRemaining = matchData?.attemptsRemaining ?? 3;

  if (isLoading) {
    return (
      <Stack gap={4}>
        <Skeleton h={24} rounded="xl" />
        <Skeleton h={40} rounded="xl" />
      </Stack>
    );
  }

  if (!hasMatch) {
    if (isPaused) {
      return (
        <StatusCard icon={LuPause} title="Pairing is paused">
          The organiser has paused pairing while more people join. You can
          still update your wishlist and generate your pair once it resumes.
        </StatusCard>
      );
    }

    if (activityStatus === "COMPLETED") {
      return (
        <StatusCard icon={LuCircleAlert} title="Activity has ended">
          Pairing is closed for this activity.
        </StatusCard>
      );
    }

    if (!isActivityActive) {
      return (
        <StatusCard icon={LuCircleAlert} title="Activity Not Started">
          The gifting activity hasn&apos;t started yet. Please wait for the
          event organizer to begin the activity.
        </StatusCard>
      );
    }

    return (
      <Card.Root>
        <Card.Body>
          <VStack gap={12} align="stretch" py={8}>
            <VStack gap={3} align="center" textAlign="center">
              <Box as={LuGift} fontSize="2xl" />
              <Heading size="md">No Pair Yet</Heading>
              <Text color="fg.muted">
                Generate your pair to see who you&apos;ll be buying a gift for!
              </Text>
            </VStack>

            <Center>
              <Box
                animation="pulse 6s infinite"
                _motionReduce={{ animation: "none" }}
              >
                <Button
                  w="120px"
                  h="120px"
                  loading={isGenerating}
                  borderRadius="full"
                  bg="green.700"
                  boxShadow="0 0 24px #008f0080, 0 0 60px #20802060"
                  color="white"
                  fontWeight="bold"
                  _hover={{ bg: "green.600" }}
                  _active={{ transform: "scale(0.96)" }}
                  onClick={() => {
                    generatePair({
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
      <ConfettiComponent key={celebrations} show={celebrations > 0} />

      {isPaused && (
        <Alert.Root status="warning" rounded="xl">
          <Alert.Indicator />
          <Alert.Title>
            Pairing is paused. You can&apos;t change your pair right now.
          </Alert.Title>
        </Alert.Root>
      )}

      <Card.Root bg="bg.muted" variant="elevated" boxShadow="lg" rounded="2xl">
        <Card.Header pb={0}>
          <Card.Title>Your Secret Match</Card.Title>
        </Card.Header>
        <Card.Body>
          <VStack gap={5} align="stretch">
            {/* Receiver Info */}
            <HStack gap={4} p={4} bg="bg.panel" rounded="xl">
              <Avatar
                name={receiver?.user?.firstName as string}
                src={receiver?.user?.image as string}
                size="lg"
              />
              <Heading size="md" flex={1} minW={0} truncate>
                {receiver?.user?.username || "Secret Person"}
              </Heading>
            </HStack>

            {budget && (
              <HStack gap={2} color="fg.muted" fontSize="sm">
                <LuWallet />
                <Text>
                  Spend at least{" "}
                  <Span fontWeight="bold" color="fg">
                    {budget}
                  </Span>{" "}
                  on their gift
                </Text>
              </HStack>
            )}

            {/* Wishlist */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Their Wishlist
              </Text>
              <Box
                p={4}
                bg="bg.panel"
                rounded="xl"
                borderLeftWidth={4}
                borderColor="green.500"
              >
                <Text lineHeight="tall" whiteSpace="pre-wrap">
                  {receiver?.wishlist || "No wishlist provided yet"}
                </Text>
              </Box>
            </Box>

            {/* Attempts Indicator */}
            <RetryIndicator count={3 - attemptsRemaining} />

            {/*Rules */}
            <VStack gap="2" align="stretch" fontSize="sm">
              {RULES.map((rule, index) => (
                <HStack
                  key={rule}
                  bg="bg.panel"
                  rounded="lg"
                  px="3"
                  py="2"
                  gap={3}
                  align="flex-start"
                >
                  <Span color="fg.muted">{index + 1}/</Span>
                  <Span>{rule}</Span>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>

      {isActivityActive && (
        <ActionBar>
          <Button
            size="lg"
            variant="outline"
            onClick={handleOpenDrawer}
            disabled={attemptsRemaining === 0}
            loading={isGenerating}
            loadingText="Generating..."
          >
            <LuRefreshCw />
            {attemptsRemaining > 0
              ? `New pair (${attemptsRemaining} left)`
              : "No attempts left"}
          </Button>
        </ActionBar>
      )}

      {activityStatus === "COMPLETED" && (
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
        onGenerated={onGenerated}
      />
    </Stack>
  );
}
