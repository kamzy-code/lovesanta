"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuLock, LuShare2 } from "react-icons/lu";
import { Button } from "~/components/ui/button";
import { toaster } from "~/components/ui/toaster";
import { api } from "~/trpc/react";

interface JoinEventProps {
  eventId: string;
}

interface EventCTAProps {
  slug: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const JoinEvent = ({ eventId }: JoinEventProps) => {
  const router = useRouter();
  const { mutate: joinEvent, isPending } = api.event.joinEvent.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      toaster.create({
        title: "Couldn't join event",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });

  const handleJoin = () => {
    joinEvent({ eventId });
  };

  return (
    <Button size="lg" onClick={handleJoin} loading={isPending} disabled={isPending}>
      <FaPlus></FaPlus>
      Join Event
    </Button>
  );
};

export const JoiningClosed = () => {
  return (
    <Button size="lg" variant="subtle" disabled>
      <LuLock />
      Joining closed
    </Button>
  );
};

export const ShareEvent = ({ slug }: EventCTAProps) => {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = `${baseURL ?? window.location.origin}/event/${slug}`;

    // Native share sheet on phones; clipboard is undefined on http and in some in-app browsers
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Join my Secret Santa", url });
      } catch {
        // user dismissed the share sheet
      }
      return;
    }

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      window.prompt("Copy this invite link", url);
    }
  };
  return (
    <Button size="lg" onClick={() => void handleShare()} disabled={copied}>
      <LuShare2 />
      {copied ? "Link Copied" : "Share Invite"}
    </Button>
  );
};

export const LoginToJoin = ({ slug }: EventCTAProps) => {
  return (
    <Button size="lg" asChild>
      <Link href={`/auth/login?slug=${slug}`}>Login to Join</Link>
    </Button>
  );
};
