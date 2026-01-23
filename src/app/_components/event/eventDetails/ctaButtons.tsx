"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { baseURL } from "routes";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface JoinEventProps {
  eventId: string;
}

interface EventCTAProps {
  slug: string;
}

export const JoinEvent = ({ eventId }: JoinEventProps) => {
  const { mutate: joinEvent, isPending } = api.event.joinEvent.useMutation({
    onSuccess: () => {
      // Handle success - maybe show a toast or refresh data
      window.location.reload();
      console.log("Successfully joined event");
    },
    onError: (error) => {
      // Handle error - show error message
      console.error("Failed to join event:", error.message);
    },
  });

  const handleJoin = () => {
    joinEvent({ eventId });
  };

  return (
    <Button onClick={handleJoin} loading={isPending} disabled={isPending}>
      <FaPlus></FaPlus>
      Join Event
    </Button>
  );
};

export const ShareEvent = ({ slug }: EventCTAProps) => {
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard
      .writeText(`${baseURL}/event/${slug}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error);
      });
  };
  return (
    <Button onClick={handleShare} disabled={copied}>
      <LuLink />
      {copied ? "Link Copied" : "Copy Invite"}
    </Button>
  );
};

export const LoginToJoin = ({slug}: EventCTAProps) => {
  return (
    <Link href={`/auth/login?slug=${slug}`}>
      <Button>Login to Join</Button>
    </Link>
  );
};
