import { Container } from "@chakra-ui/react";
import { Suspense } from "react";
import { EventFeedSkeleton } from "~/app/_components/event/event-feed/skeleton";

export default async function EventDetails({searchParams}:{searchParams: Promise<{slug: string}>}){
    const {slug} = await searchParams;
    return <Container maxW="6xl" pb={24}>
            <Suspense fallback={<EventFeedSkeleton />}>

            </Suspense>
          </Container>
}