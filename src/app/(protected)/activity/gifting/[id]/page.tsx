import { Container } from "@chakra-ui/react";
import { GiftingActivity } from "~/app/_components/event/eventDetails/activity/gifting";
import { api } from "~/trpc/server";

export default async function GiftingActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await api.activity.getActivityById({ activityId: id });
  return (
    <Container>
      <GiftingActivity
        activity={activity}
        eventId={activity?.eventId}
        participantId={activity.currentUserParticipantId!}
      />
    </Container>
  );
}
