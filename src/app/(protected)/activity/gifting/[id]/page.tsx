import { Container } from "@chakra-ui/react";
import { Suspense } from "react";
import { GiftingActivity } from "~/app/_components/event/eventDetails/activity/gifting";
import { PageLoader } from "~/components/ui/pageLoader";

export default async function GiftingActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageLoader />}>
      <Container>
        <GiftingActivity activityId={id} />
      </Container>
    </Suspense>
  );
}
