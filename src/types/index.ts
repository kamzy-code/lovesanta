export type ParticipantWithUser = {
  user: {
    image: string | null;
    firstName: string | null;
    username: string | null;
  };
} & {
  id: string;
  userId: string;
  eventId: string;
  wishlist: string | null;
  joinedAt: Date;
};
