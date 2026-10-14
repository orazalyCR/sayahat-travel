import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify, tourSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

/**
 * GET /api/tours
 * Публичный список туров. Параметры query:
 *   ?hot=true        — только «горящие» туры (для витрины на главной)
 *   ?status=PUBLISHED — по умолчанию отдаём только опубликованные
 * Для админки (авторизованный пользователь) можно передать ?status=ALL,
 * чтобы увидеть черновики и архив.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hotOnly = searchParams.get("hot") === "true";
  const statusParam = searchParams.get("status");

  const session = await getServerSession(authOptions);

  const where: Prisma.TourWhereInput = {};

  if (hotOnly) where.isHot = true;

  if (statusParam === "ALL" && session) {
    // показываем все статусы только авторизованным сотрудникам
  } else if (statusParam && session) {
    where.status = statusParam as Prisma.TourWhereInput["status"];
  } else {
    // публичный доступ видит только опубликованные туры
    where.status = "PUBLISHED";
  }

  const tours = await prisma.tour.findMany({
    where,
    orderBy: [{ isHot: "desc" }, { startDate: "asc" }],
  });

  return NextResponse.json({ tours });
}

/**
 * POST /api/tours
 * Создание нового тура. Доступно только авторизованным сотрудникам.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = tourSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ошибка валидации", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title) || "tour";
  let slug = baseSlug;
  let suffix = 1;
  // гарантируем уникальность slug
  while (await prisma.tour.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const tour = await prisma.tour.create({
    data: {
      ...data,
      slug,
      createdById: (session.user as { id?: string }).id ?? (await requireAdminId(session.user.email)),
    },
  });

  return NextResponse.json({ tour }, { status: 201 });
}

async function requireAdminId(email?: string | null) {
  if (!email) throw new Error("Сессия без email");
  const admin = await prisma.admin.findUniqueOrThrow({ where: { email } });
  return admin.id;
}
