import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { type User, type EventStatus } from "@prisma/client";
import { CreateEventAndEnrollParticipans } from "../../lib/common/createEventWithParticipants";
// import {
//   demoUsers as users,
//   // users
//  } from "./_users";

const event = {
  name: "Secret Santa 2025",
  year: 2025,
  description: "Secret Santa for the year 2025",
  status: "ACTIVE" as "ACTIVE" | "ENDED" | "UPCOMING",
};

const users: Pick<User, "name" | "username" | "passcode" | "region" | "category" | "bio">[] =
  [
    {
      name: "Stella",
      passcode: "100001",
      username: "Stella",
      region: "Africa",
      category: "adult",
      bio: "Hoping for a new laptop this Christmas!",
    },
    {
      name: "Chikezie",
      passcode: "100002",
      username: "Chikezie",
      region: "Africa",
      category: "adult",
      bio: "A good book collection and a cozy blanket are on my list.",
    },
    {
      name: "Sharon",
      passcode: "100003",
      username: "Sharon",
      region: "Africa",
      category: "adult",
      bio: "I wish for noise-canceling headphones this year.",
    },
    {
      name: "Mkpurouma",
      passcode: "100004",
      username: "Mkpurouma",
      region: "Africa",
      category: "adult",
      bio: "A subscription to a coding course would be perfect!",
    },
    {
      name: "Bukky",
      passcode: "100005",
      username: "Bukky",
      region: "Africa",
      category: "adult",
      bio: "Just peace and maybe some art supplies, please.",
    },
    {
      name: "Joy",
      passcode: "100006",
      username: "Joy",
      region: "Africa",
      category: "adult",
      bio: "A new pair of running shoes would bring me joy.",
    },
    {
      name: "Uchechi",
      passcode: "100007",
      username: "Uchechi",
      region: "Africa",
      category: "adult",
      bio: "A comfortable ergonomic chair for my workspace.",
    },
    {
      name: "Ezinne",
      passcode: "100008",
      username: "Ezinne",
      region: "Africa",
      category: "adult",
      bio: "I'd love a high-quality camera lens for my travels.",
    },
    {
      name: "Winner",
      passcode: "100009",
      username: "Winner",
      region: "Africa",
      category: "adult",
      bio: "A new smart watch is all I really want.",
    },
    {
      name: "Ruth",
      passcode: "100010",
      username: "Ruth",
      region: "America",
      category: "adult",
      bio: "I'm wishing for a weekend getaway trip.",
    },
    {
      name: "Amarachi",
      passcode: "100011",
      username: "Amarachi",
      region: "America",
      category: "adult",
      bio: "New set of kitchen gadgets to practice cooking.",
    },
    {
      name: "Princess",
      passcode: "100012",
      username: "Princess",
      region: "Africa",
      category: "adult",
      bio: "A fancy handbag and some perfume would be lovely.",
    },
    {
      name: "Prince",
      passcode: "100013",
      username: "Prince",
      region: "Africa",
      category: "adult",
      bio: "A new gaming console or a graphics card upgrade.",
    },
    {
      name: "Chinedu",
      passcode: "100014",
      username: "Chinedu",
      region: "Africa",
      category: "adult",
      bio: "A nice leather journal for writing my thoughts.",
    },
    {
      name: "Stephanie",
      passcode: "100015",
      username: "Stephanie",
      region: "Africa",
      category: "adult",
      bio: "A tablet for reading and sketching in my spare time.",
    },
    {
      name: "Chibueze",
      passcode: "100016",
      username: "Chibueze",
      region: "Africa",
      category: "kids",
      bio: "A drone for capturing amazing aerial photos.",
    },
    {
      name: "Chiwenmeri",
      passcode: "100017",
      username: "Chiwenmeri",
      region: "Africa",
      category: "kids",
      bio: "I hope for comfortable new pajamas and slippers.",
    },
    {
      name: "Melody",
      passcode: "100018",
      username: "Melody",
      region: "Africa",
      category: "kids",
      bio: "A musical instrument (ukulele or keyboard) is my wish.",
    },
    {
      name: "Divine",
      passcode: "100019",
      username: "Divine",
      region: "Africa",
      category: "adult",
      bio: "A new pair of high-quality sunglasses.",
    },
    {
      name: "Chisom",
      passcode: "100020",
      username: "Chisom",
      region: "Africa",
      category: "kids",
      bio: "A nice portable Bluetooth speaker for music.",
    },
    {
      name: "Treasure",
      passcode: "100021",
      username: "Treasure",
      region: "Africa",
      category: "kids",
      bio: "A set of cozy candles and a weighted blanket.",
    },
  ];

// export async function POST(request: Request)
export async function GET(_request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not in development mode" },
      { status: 500 },
    );
  }

  try {
    // const users: Omit<User, "id" | "createdAt" | "updatedAt">[] =
    //   await request.json();

    const { createdUsers, eventCreatePayload, enrolledParticipants } =
      await CreateEventAndEnrollParticipans({
        event: event,
        usersList: users,
      });

    return NextResponse.json(
      {
        message: "Operation created successfully",
        count: createdUsers.length,
        participants: enrolledParticipants.count,
        payload: eventCreatePayload,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating users:", error);
    return NextResponse.json(
      { error: "Failed to create users" },
      { status: 500 },
    );
  }
}
