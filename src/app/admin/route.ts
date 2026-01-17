import { NextResponse } from "next/server";
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

const users: Partial<User>[] =
  [
    
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
