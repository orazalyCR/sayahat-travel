import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sayahat.travel" },
    update: {},
    create: {
      email: "admin@sayahat.travel",
      passwordHash,
      name: "Администратор",
      role: "OWNER",
    },
  });

  await prisma.tour.createMany({
    data: [
      {
        slug: "antalya-7-nochey",
        title: "Анталия, 7 ночей — всё включено",
        shortDescription: "Пляжный отдых на берегу Средиземного моря",
        description:
          "Перелёт, трансфер, отель 5*, питание «всё включено». Один из самых популярных горящих туров сезона.",
        country: "Турция",
        city: "Анталия",
        price: 420000,
        oldPrice: 540000,
        currency: "KZT",
        startDate: new Date("2026-11-10"),
        endDate: new Date("2026-11-17"),
        durationDays: 7,
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        isHot: true,
        status: "PUBLISHED",
        createdById: admin.id,
      },
      {
        slug: "phuket-10-nochey",
        title: "Пхукет, 10 ночей",
        shortDescription: "Тёплое море, острова и тайская кухня",
        description:
          "Перелёт с пересадкой, трансфер, отель 4*, завтраки. Свободная программа + экскурсии по желанию.",
        country: "Таиланд",
        city: "Пхукет",
        price: 650000,
        currency: "KZT",
        startDate: new Date("2026-12-05"),
        endDate: new Date("2026-12-15"),
        durationDays: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200",
        isHot: true,
        status: "PUBLISHED",
        createdById: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Сид выполнен. Логин администратора: admin@sayahat.travel / ChangeMe123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
