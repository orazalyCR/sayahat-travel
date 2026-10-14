import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tourUpdateSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  const tour = await prisma.tour.findUnique({ where: { id: params.id } });
  if (!tour) {
    return NextResponse.json({ error: "Тур не найден" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (tour.status !== "PUBLISHED" && !session) {
    // неопубликованные туры не показываем анонимным пользователям
    return NextResponse.json({ error: "Тур не найден" }, { status: 404 });
  }

  return NextResponse.json({ tour });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = tourUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ошибка валидации", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const existing = await prisma.tour.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Тур не найден" }, { status: 404 });
  }

  const tour = await prisma.tour.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ tour });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const existing = await prisma.tour.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Тур не найден" }, { status: 404 });
  }

  await prisma.tour.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
