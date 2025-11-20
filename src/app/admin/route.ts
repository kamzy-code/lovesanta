import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { type User } from "@prisma/client";
// import { 
//   demoUsers as users, 
//   // users
//  } from "./_users";

const users: Pick<
User,
"name" | "username" | "passcode" | "region" | "bio"
>[] = [
  {
    name: "Stella",
    passcode: "100001",
    username: "Stella",
    region: "Africa",
    bio: "Hoping for a new laptop this Christmas!",
  },
  {
    name: "Chikezie",
    passcode: "100002",
    username: "Chikezie",
    region: "Africa",
    bio: "A good book collection and a cozy blanket are on my list.",
  },
  {
    name: "Sharon",
    passcode: "100003",
    username: "Sharon",
    region: "Africa",
    bio: "I wish for noise-canceling headphones this year.",
  },
  {
    name: "Mkpurouma",
    passcode: "100004",
    username: "Mkpurouma",
    region: "Africa",
    bio: "A subscription to a coding course would be perfect!",
  },
  {
    name: "Bukky",
    passcode: "100005",
    username: "Bukky",
    region: "Africa",
    bio: "Just peace and maybe some art supplies, please.",
  },
  {
    name: "Joy",
    passcode: "100006",
    username: "Joy",
    region: "Africa",
    bio: "A new pair of running shoes would bring me joy.",
  },
  {
    name: "Uchechi",
    passcode: "100007",
    username: "Uchechi",
    region: "Africa",
    bio: "A comfortable ergonomic chair for my workspace.",
  },
  {
    name: "Ezinne",
    passcode: "100008",
    username: "Ezinne",
    region: "Africa",
    bio: "I'd love a high-quality camera lens for my travels.",
  },
  {
    name: "Winner",
    passcode: "100009",
    username: "Winner",
    region: "Africa",
    bio: "A new smart watch is all I really want.",
  },
  {
    name: "Ruth",
    passcode: "100010",
    username: "Ruth",
    region: "Africa",
    bio: "I'm wishing for a weekend getaway trip.",
  },
  {
    name: "Amarachi",
    passcode: "100011",
    username: "Amarachi",
    region: "Africa",
    bio: "New set of kitchen gadgets to practice cooking.",
  },
  {
    name: "Princess",
    passcode: "100012",
    username: "Princess",
    region: "Africa",
    bio: "A fancy handbag and some perfume would be lovely.",
  },
  {
    name: "Prince",
    passcode: "100013",
    username: "Prince",
    region: "Africa",
    bio: "A new gaming console or a graphics card upgrade.",
  },
  {
    name: "Chinedu",
    passcode: "100014",
    username: "Chinedu",
    region: "Africa",
    bio: "A nice leather journal for writing my thoughts.",
  },
  {
    name: "Stephanie",
    passcode: "100015",
    username: "Stephanie",
    region: "Africa",
    bio: "A tablet for reading and sketching in my spare time.",
  },
  {
    name: "Chibueze",
    passcode: "100016",
    username: "Chibueze",
    region: "Africa",
    bio: "A drone for capturing amazing aerial photos.",
  },
  {
    name: "Chiwenmeri",
    passcode: "100017",
    username: "Chiwenmeri",
    region: "Africa",
    bio: "I hope for comfortable new pajamas and slippers.",
  },
  {
    name: "Melody",
    passcode: "100018",
    username: "Melody",
    region: "Africa",
    bio: "A musical instrument (ukulele or keyboard) is my wish.",
  },
  {
    name: "Divine",
    passcode: "100019",
    username: "Divine",
    region: "Africa",
    bio: "A new pair of high-quality sunglasses.",
  },
  {
    name: "Chisom",
    passcode: "100020",
    username: "Chisom",
    region: "Africa",
    bio: "A nice portable Bluetooth speaker for music.",
  },
  {
    name: "Treasure",
    passcode: "100021",
    username: "Treasure",
    region: "Africa",
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

    const createdUsers = await db.user.createMany({
      data: users.map((user)=> ({
        ...user,
        username: user.username?.toLowerCase()
      })),
      // Optional: skips records that conflict with unique constraints
      skipDuplicates: true,
    });

    // const event = await db.event.findFirstOrThrow({
    //   where: {
    //     id: "cm4hjss4400153b5ug0imp2v3",
    //   },
    // });

    const event = await db.event.create({
      data: {
        name: "Secret Santa 2025",
        year: 2025,
        description: "Secret Santa for the year 2025",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        status: "ACTIVE",

      },
    });



    const eventCreatePayload = (await db.user.findMany({})).map((user) => ({
      eventId: event.id,
      userId: user.id,
      wishlist: user.bio,
      region: user.region,
      budget: 100,
      hasJoined: true,
    }));

    // Enroll users for the event
    const enrollUsers = await db.participant.createMany({
      data: eventCreatePayload,
      skipDuplicates: true,
    });

    // console.log({ enrollUsers, eventCreatePayload });

    return NextResponse.json(
      {
        message: "Operation created successfully",
        count: createdUsers.count,
        participants: enrollUsers.count,
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
