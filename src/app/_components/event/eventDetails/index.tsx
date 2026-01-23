import {
  Badge,
  Box,
  Container,
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

export async function EventDetailsComponent({ slug }: { slug: string }) {
  const session = await auth();
  const event = await api.event.getBySlug({ slug });
  const hasJoined = event?.participants.some(
    (p) => p.userId === session?.user.id,
  );

  return (
    <Container py={{ base: "12", md: "24" }} spaceY={"6"}>
      {session && (
        <Link href={"/home"}>
          <Button variant={"outline"} size={"lg"} border={"1px solid"}>
            Back
          </Button>
        </Link>
      )}

      <Stack gap="6">
        <Box spaceY={"6"}>
          <Box spaceY={"2"}>
            <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
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
            {session && !hasJoined && <JoinEvent eventId={event?.id!} />}
            {!session && <LoginToJoin slug={slug} />}
          </HStack>
        </Box>
      </Stack>

      <EventTabs participants={event?.participants ? event.participants : []} />
    </Container>
  );
}
