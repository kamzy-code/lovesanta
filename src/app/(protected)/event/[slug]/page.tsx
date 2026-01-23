import { Container } from "@chakra-ui/react";
import { Suspense } from "react";
import { EventFeedSkeleton } from "~/app/_components/event/event-feed/skeleton";
import { EventDetailsComponent } from "~/app/_components/event/eventDetails";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log({ slug });
  return (
    <Container maxW="6xl" pb={24}>
      <Suspense fallback={<EventFeedSkeleton />}>
        <EventDetailsComponent slug={slug} />
      </Suspense>
    </Container>
  );
}
