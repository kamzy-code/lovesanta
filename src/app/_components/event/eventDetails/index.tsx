import {
  AbsoluteCenter,
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  Wrap,
} from "@chakra-ui/react";
import Link from "next/link";
import { LuCalendar, LuMapPin, LuUsers } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { AppBar } from "~/components/ui/app-bar";
import { ActionBar } from "~/components/ui/action-bar";
import { formatDateToString } from "~/lib/common/helpers";
import { api } from "~/trpc/server";
import { EventTabs } from "./tabLayout";
import { auth } from "~/server/auth";
import { JoinEvent, JoiningClosed, LoginToJoin, ShareEvent } from "./ctaButtons";
import { EventKebabMenu } from "./eventKebabMenu";

export async function EventDetailsComponent({ slug }: { slug: string }) {
  const session = await auth();
  const event = await api.event.getBySlug({ slug });

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

  const hasJoined = event.participants.some(
    (p) => p.userId === session?.user.id,
  );
  const isCreator = event.creatorId === session?.user.id;
  const joiningClosed = event.activities.some(
    (a) => a.type === "GIFTING" && a.status === "COMPLETED",
  );

  return (
    <Stack gap={{ base: 5, md: 8 }} pb={{ md: 12 }}>
      <AppBar
        backHref={session ? "/home" : undefined}
        actions={
          session && <EventKebabMenu isCreator={isCreator} eventId={event.id} />
        }
      />

      <Stack gap={3}>
        <Heading
          size={{ base: "3xl", md: "4xl" }}
          lineHeight="shorter"
        >
          {event.title}
        </Heading>
        {event.description && (
          <Text color={"fg.muted"}>{event.description}</Text>
        )}
        <Text color={"fg.muted"} fontSize="sm">
          Created by @{event.creator.username}
        </Text>

        <Wrap gap={2} mt={1}>
          <Badge size="lg" variant="surface" colorPalette="green">
            {event.status}
          </Badge>
          <Badge size="lg" variant="outline">
            <LuCalendar />
            {formatDateToString(event.date)}
          </Badge>
          {event.location && (
            <Badge size="lg" variant="outline">
              <LuMapPin />
              {event.location}
            </Badge>
          )}
          <Badge size="lg" variant="outline">
            <LuUsers />
            {event.participants.length}
          </Badge>
        </Wrap>
      </Stack>

      <Box>
        <ActionBar>
          {session && hasJoined && <ShareEvent slug={slug} />}
          {session && !hasJoined && !joiningClosed && (
            <JoinEvent eventId={event.id} />
          )}
          {session && !hasJoined && joiningClosed && <JoiningClosed />}
          {!session && <LoginToJoin slug={slug} />}
        </ActionBar>
      </Box>

      <EventTabs
        eventId={event.id}
        isCreator={isCreator}
        participants={event.participants}
      />
    </Stack>
  );
}
