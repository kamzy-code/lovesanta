import { HydrateClient } from "~/trpc/server";

import { EventFeedComponent } from "~/app/_components/event/event-feed";
import { NavbarComponent } from "~/components/navbar/block";
import { Container } from "@chakra-ui/react";
import { Suspense } from "react";
import { EventFeedSkeleton } from "~/app/_components/event/event-feed/skeleton";

export default async function Home() {
  /**
   *
   * @operation
   * Merge the events from the database and the static events
   * and sort them by date in descending order
   *
   * This is a temp solution, as we are also ready from the db directly
   * Ideally would move this over to a trpc query to handle all the heavy lifting
   *
   * And in the future only show events the user already joined instead of pulling
   * all events from the db
   */

  return (
    <HydrateClient>
      <Container maxW="6xl" pb={24}>
        <Suspense fallback={<EventFeedSkeleton />}>
          <EventFeedComponent />
        </Suspense>
      </Container>
    </HydrateClient>
  );
}
