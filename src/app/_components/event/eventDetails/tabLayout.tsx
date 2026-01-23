import { Center, Container, Stack, Tabs, VStack } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { ParticipantWithUser } from "~/types";
import { ParticipantList } from "./particpant";
import { auth } from "~/server/auth";
interface EventTabProps {
  participants: ParticipantWithUser[];
}
export async function EventTabs({ participants }: EventTabProps) {
  const session = await auth();
  return (
    <Tabs.Root defaultValue="activities">
      <Tabs.List>
        <Tabs.Trigger value="activities">
          <LuFolder />
          Activities
        </Tabs.Trigger>
        <Tabs.Trigger value="participants">
          <LuUser />
          Participants
        </Tabs.Trigger>
        <Tabs.Trigger value="teams">
          <LuSquareCheck />
          Teams
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="activities">
        {" "}
        {session ? (
          <Center pt={12}>Activities</Center>
        ) : (
          <Center pt={12}>Login to View Activities</Center>
        )}
      </Tabs.Content>

      <Tabs.Content value="participants">
        {session ? (
          <ParticipantList participants={participants} />
        ) : (
          <Center pt={12}>Login to View Participants</Center>
        )}
      </Tabs.Content>

      <Tabs.Content value="teams">
        {" "}
        {session ? (
          <Center pt={12}>Teams</Center>
        ) : (
          <Center pt={12}>Login to View Teams</Center>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}
