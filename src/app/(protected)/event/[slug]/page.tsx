import { Container } from "@chakra-ui/react";
import { Suspense } from "react";
import { EventFeedSkeleton } from "~/app/_components/event/event-feed/skeleton";
import { EventDetailsComponent } from "~/app/_components/event/eventDetails";
import { AddActivityModal } from "~/app/_components/event/eventDetails/activity/addActivityModal";
import { PageLoader } from "~/components/ui/pageLoader";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense fallback={<PageLoader/>}>
      <Container maxW="6xl">
        <EventDetailsComponent slug={slug} />
      </Container>
    </Suspense>
  );
}
