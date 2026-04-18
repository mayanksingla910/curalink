import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      context: true,
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true, createdAt: true }
      }
    }
  });

  return NextResponse.json({ chats });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const body = await req.json();
  console.log("Creating chat with body:", body);
  const { disease, name, location } = body;

  const chat = await prisma.chat.create({
    data: {
      userId: session?.user.id ?? null,
      isGuest: !session,
      title: disease ? `${disease} research` : "New Chat",
      context: disease
        ? {
            create: {
              disease,
              name: name ?? null,
              location: location ?? null,
            },
          }
        : undefined,
    },
    include: { context: true },
  });

  return NextResponse.json({ chat }, { status: 201 });
}