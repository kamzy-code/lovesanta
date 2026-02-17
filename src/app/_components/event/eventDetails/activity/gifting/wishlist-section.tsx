"use client";

import React, { useEffect } from "react";
import {
  Box,
  Card,
  Heading,
  Textarea,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { toaster, Toaster } from "~/components/ui/toaster";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { LuCheck, LuLoader } from "react-icons/lu";

interface WishlistSectionProps {
  eventId: string;
  participantId: string;
}

interface WishlistFormValues {
  wishlist: string;
}

export function WishlistSection({
  eventId,
  participantId,
}: WishlistSectionProps) {
  const toast = toaster.create;
  const utils = api.useUtils();

  // Fetch current wishlist
  const { data: participant } = api.gifting.getParticipant.useQuery({
    participantId,
  });

  const { register, handleSubmit, watch, reset } = useForm<WishlistFormValues>({
    defaultValues: {
      wishlist: "",
    },
  });

  // Populate form when participant data becomes available
  useEffect(() => {
    if (participant) {
      reset({ wishlist: participant.wishlist || "" });
    }
  }, [participant, reset]);

  const { mutate: updateWishlist, isPending } =
    api.gifting.updateParticipantWishlist.useMutation({
      onSuccess: async () => {
        toast({
          title: "Success",
          description: "Your wishlist has been updated!",
          type: "success",
          duration: 3000,
        });
        await utils.gifting.getParticipant.invalidate({
          participantId,
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          type: "error",
          duration: 3000,
        });
      },
    });

  const onSubmit = (data: WishlistFormValues) => {
    updateWishlist({
      participantId,
      eventId,
      wishlist: data.wishlist,
    });
  };

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Your Wishlist</Card.Title>
        <Card.Description>
          Tell your Secret Santa what gifts you&apos;d love to receive. Be as
          specific as possible!
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Toaster />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack gap={4} align="stretch">
            <Box>
              <Textarea
                resize={"none"}
                placeholder="I want the new iPhone 16, a cozy sweater, the latest sci-fi book series..."
                minH="150px"
                {...register("wishlist")}
              />
              <Text fontSize="xs" color="fg.muted" mt={2}>
                Updated wishlists help your Secret Santa choose the perfect
                gift!
              </Text>
            </Box>

            <HStack justify="flex-end" gap={3}>
              <Button
                variant="outline"
                onClick={() => reset()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                loadingText="Saving..."
              >
                {isPending ? (
                  <>
                    <LuLoader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <LuCheck />
                    Save Wishlist
                  </>
                )}
              </Button>
            </HStack>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
