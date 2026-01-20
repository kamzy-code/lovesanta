import {
  Badge,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Status } from "~/components/ui/status";
import { LuChevronRight, LuUser } from "react-icons/lu";
import { calculateDaysAgo, formatDateToString } from "~/lib/common/helpers";
import Link from "next/link";
import { auth } from "~/server/auth";
import { Button } from "../../../../components/ui/button";
import { api } from "~/trpc/server";
import {
  events as staleEvents,
  type EventWithCount,
} from "~/app/_components/event/event-feed/_data";

export const EventFeedComponent = async () => {
  const dbEvents = await api.event.fetchAlEvents();
  const events = [
    ...staleEvents,
    ...dbEvents.map((p) => ({ ...p, participantCount: p.participants.length })),
  ].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }) as EventWithCount[];

  const session = await auth();
  return (
    <Container py={{ base: "12", md: "24" }}>
      <Stack gap="6">
         <Stack gap={{ base: "2", md: "3" }} justify={'start'}>
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Events
          </Heading>
          {/* <Text color="fg.muted"></Text> */}
        </Stack>

        <HStack
        gap={4}
          
          justify={"space-between"}
        >
          <Heading size={{ base: "lg", md: `xl` }}>
            Welcome {session?.user?.username ?? "User"}!
          </Heading>

          <Link href={"/event/create"}>
            <Button
              variant={"outline"}
              borderColor={{ base: "fg.subtle", _dark: "gray.700" }}
              _hover={{
                color: "green.600/70",
              }}
            >
              + Create Event
            </Button>
          </Link>
        </HStack>

        {events.map((event) => (
          <Link
            href={event.status != "ENDED" ? `/event/${event.id}` : "#"}
            key={event.id}
          >
            <Flex
              _hover={{
                bg: "bg.subtle",
                opacity: 0.9,
                color: "lime.600",
              }}
              key={event.id}
              borderWidth="1px"
              boxShadow={"md"}
              borderRadius="l3"
              borderColor={{
                base: "fg.subtle",
                _dark: event.status === "ENDED" ? "gray.700" : "teal.200/20",
              }}
              divideX={{base:"none", sm:'1px'}}
              divideY={{base:"1px", sm:'none'}}
              flexDirection={{base:'column', sm:'row'}}
              bg="bg"
              _disabled={{ bg: "bg.subtle", cursor: "not-allowed" }}
              aria-disabled={event.status === "ENDED"}
            >
              <Stack p="6" flex="1">
                <HStack>
                  <Badge variant="surface" alignSelf="flex-start">
                    {event.status}
                  </Badge>
                  <Text
                    textStyle="sm"
                    textTransform={"uppercase"}
                    fontWeight="semibold"
                    color={"fg.muted"}
                  >
                    {event.title}
                  </Text>
                </HStack>
                {/* <Text color="fg.muted" lineClamp={2}>
                  {event.description}
                </Text> */}

                <HStack fontWeight="medium" mt="4">
                  <Text textStyle="sm" color="fg.muted">
                    {calculateDaysAgo(event.date)}
                  </Text>
                  <Spacer />

                  <HStack gap="4">
                    <HStack gap="1">
                      <LuUser />

                      <Text textStyle="sm" color="fg.muted">
                        {`${Number(event.participantCount ?? 0)} participant${Number(event.participantCount) > 1 ? "s" : ""}`}
                      </Text>
                    </HStack>
                    <Status hideBelow="sm">
                      {formatDateToString(event.date)}
                    </Status>
                  </HStack>
                </HStack>
              </Stack>
              <VStack
                color={event.status == "ENDED" ? "fg.subtle" : "fg"}
                px="4"
                py={{base: '4', sm:'0'}}
                flexDirection={{base: 'row', sm:'column'}}
                justify="center"
                flexShrink="0"
              >
                <LuChevronRight />
                <Text textStyle="sm" fontWeight="semibold">
                  {"view"}
                </Text>
              </VStack>
            </Flex>
          </Link>
        ))}
      </Stack>
    </Container>
  );
};
