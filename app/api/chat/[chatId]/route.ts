import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      context: true,
      messages: { orderBy: { createdAt: "asc" } }
    },
  });

  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ chat });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { title } = await req.json();
  const { chatId } = await params;
  const chat = await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });
  return NextResponse.json({ chat });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  await prisma.chat.delete({ where: { id: chatId } });
  return NextResponse.json({ success: true });
}