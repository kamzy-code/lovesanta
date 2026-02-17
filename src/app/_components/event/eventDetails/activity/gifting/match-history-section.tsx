"use client";

import { Card, VStack, HStack, Badge, Text, Box } from "@chakra-ui/react";
import { api } from "~/trpc/react";
import { LuHistory, LuLoader } from "react-icons/lu";
import { Avatar } from "~/components/ui/avatar";

interface MatchHistorySectionProps {
  eventId: string;
  participantId: string;
}

export function MatchHistorySection({
  eventId,
  participantId,
}: MatchHistorySectionProps) {
  const { data: history = [], isLoading } =
    api.gifting.getMatchHistory.useQuery({
      participantId,
      eventId,
    });

  if (isLoading) {
    return (
      <Card.Root>
        <Card.Body>
          <HStack justify="center" py={12}>
            <LuLoader className="animate-spin" />
            <Text>Loading history...</Text>
          </HStack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (history.length === 0) {
    return (
      <Card.Root>
        <Card.Header>
          <Card.Title display="flex" gap={2} alignItems="center">
            <Box as={LuHistory} fontSize="lg" />
            Previous Pairs
          </Card.Title>
          <Card.Description>
            You haven&apos;t had any previous pairs yet
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Text color="fg.muted">
            When you regenerate your pair, previous matches will appear here for
            your reference.
          </Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title display="flex" gap={2} alignItems="center">
          <Box as={LuHistory} fontSize="lg" />
          Previous Pairs
        </Card.Title>
        <Card.Description>
          You&apos;ve previously been matched with these individuals
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <VStack gap={3} align="stretch">
          {history.map((match, index) => (
            <Box
              key={match.id}
              p={4}
              bg="bg.panel"
              rounded="lg"
              borderLeftWidth={4}
              borderColor={index === 0 ? "orange.500" : "gray.500"}
            >
              <HStack gap={3} justify="space-between">
                <HStack gap={3} flex={1}>
                  <Avatar
                    name={match.receiver?.firstName as string}
                    src={match.receiver?.image as string}
                    size="md"
                  />
                  <VStack align="flex-start" gap={0}>
                    <Text fontWeight="bold">
                      {match.receiver?.firstName || "Unknown"}
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                      {match.receiver?.email}
                    </Text>
                  </VStack>
                </HStack>
                <Badge colorScheme={index === 0 ? "orange" : "gray"}>
                  Attempt {index + 1}
                </Badge>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
