import { Container } from "@chakra-ui/react";
import { GiftingActivity } from "~/app/_components/event/eventDetails/activity/gifting";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function GiftingActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const activity = await api.activity.getActivityById({ activityId: id });
  const isCreator = activity.event.creatorId === session?.user.id;
  return (
    <HydrateClient>
      <Container>
        <GiftingActivity
          activity={activity}
          eventId={activity?.eventId}
          participantId={activity.currentUserParticipantId!}
          isCreator={isCreator}
        />
      </Container>
    </HydrateClient>
  );
}
