import { Container, Stack } from "@chakra-ui/react";
import { api } from "~/trpc/server";

export async function EventDetailsComponent({ slug }: { slug: string }) {
    const event = await api.event.getBySlug({slug})

  return (
    <Container py={{ base: "12", md: "24" }}>
      <Stack gap="6">
        
      </Stack>
    </Container>
  );
}
