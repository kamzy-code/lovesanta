import { Container, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaCircleXmark } from "react-icons/fa6";
import { CreateEventForm } from "~/app/_components/event/createEventForm";
import { Button } from "~/components/ui/button";

export default function CreateEvent() {
  return (
    <Container py={24} maxW={"3xl"} position={"relative"}>
      <Link href={"/home"}>
        <Button variant={"ghost"} position={'absolute'} top={{base:12, md:24}} right={4} size={"lg"}>
          <FaCircleXmark />
        </Button>
      </Link>

      <Stack gap="8">
        <VStack gap={{ base: "2", md: "3" }} textAlign={"center"}>
          <Heading fontFamily={"Alliance"} size={{ base: "3xl", md: "4xl" }}>
            Create Event
          </Heading>
          <Text color="fg.muted">Create a new event</Text>
        </VStack>

        <CreateEventForm />
      </Stack>
    </Container>
  );
}
