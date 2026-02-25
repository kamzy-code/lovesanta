import {
  AbsoluteCenter,
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaMapPin } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { formatDateToString } from "~/lib/common/helpers";
import { api } from "~/trpc/server";
import { EventTabs } from "./tabLayout";
import { auth } from "~/server/auth";
import { JoinEvent, LoginToJoin, ShareEvent } from "./ctaButtons";
import { EventKebabMenu } from "./eventKebabMenu";

export async function EventDetailsComponent({ slug }: { slug: string }) {
  const session = await auth();
  const event = await api.event.getBySlug({ slug });
  const hasJoined = event?.participants.some(
    (p) => p.userId === session?.user.id,
  );
  const isCreator = event?.creatorId === session?.user.id;

  if (!event) {
    return (
      <Container minH={"vh"} py={{ base: "12", md: "24" }}>
        <AbsoluteCenter flexDir={"column"} gap={4}>
          <Heading>Event Not Found</Heading>

          <Link href={"/home"}>
            <Button variant={"outline"} size={"lg"} border={"1px solid"}>
              Back
            </Button>
          </Link>
        </AbsoluteCenter>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container minH={"vh"} py={{ base: "12", md: "24" }}>
        <AbsoluteCenter flexDir={"column"} gap={4}>
          <Heading>Event Not Found</Heading>

          <Link href={"/home"}>
            <Button variant={"outline"} size={"lg"} border={"1px solid"}>
              Back
            </Button>
          </Link>
        </AbsoluteCenter>
      </Container>
    );
  }
  return (
    <Flex
      py={{ base: "12", md: "24" }}
      spaceY={"6"}
      direction="column"
      h="vh"
      overflow="hidden"
    >
      <Box spaceY={"6"} flexShrink={0}>
        {session && (
          <HStack justify={"space-between"}>
            <Link href={"/home"}>
              <Button variant={"outline"} size={"lg"} border={"1px solid"}>
                Back
              </Button>
            </Link>

            <EventKebabMenu isCreator={isCreator} eventId={event.id} />
          </HStack>
        )}

        <Stack gap="6">
          <Box spaceY={"6"}>
            <Box spaceY={"2"}>
              <Heading
                fontFamily={"Alliance"}
                size={{ base: "3xl", md: "4xl" }}
              >
                {event?.title}
              </Heading>
              <Box>
                <Text color={"fg.muted"}>{event?.description}</Text>
                <Text
                  color={"fg.muted"}
                >{`Creatd By: ${event?.creator.username}`}</Text>
              </Box>
            </Box>

            <HStack justify="space-between" mt={4}>
              <Text fontWeight="bold">
                {event?.date ? formatDateToString(event?.date) : "NO DATE"}
              </Text>
              <Badge variant="surface" colorScheme={"green"}>
                {event?.status}
              </Badge>
            </HStack>

            <HStack
              alignItems={"start"}
              justify="space-between"
              mt={4}
              flexDirection={{ base: "column", sm: "row" }}
              gap={"2"}
            >
              <HStack>
                <FaMapPin />
                <Text> {event?.location}</Text>
              </HStack>
              {session && hasJoined && <ShareEvent slug={slug} />}
              {session && !hasJoined && <JoinEvent eventId={event?.id} />}
              {!session && <LoginToJoin slug={slug} />}
            </HStack>
          </Box>
        </Stack>
      </Box>

      <EventTabs
        eventId={event?.id}
        isCreator={event.creatorId === session?.user.id}
        participants={event?.participants ? event.participants : []}
      />
    </Flex>
  );
}
