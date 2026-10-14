import Header from "@/components/Header";
import ContactSection from "@/components/ContactSection";
import TourList from "@/components/TourList";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // перегенерировать страницу не чаще раза в минуту

async function getHotTours() {
  return prisma.tour.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isHot: "desc" }, { startDate: "asc" }],
    take: 12,
  });
}

export default async function HomePage() {
  const tours = await getHotTours();

  return (
    <>
      <Header />

      <main>
        <section className="bg-gradient-to-b from-ocean-100 to-sand-50 px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-ocean-900 sm:text-5xl">
            Путешествия, которые остаются с вами навсегда
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ocean-700">
            Подбираем горящие туры по лучшим ценам: пляжный отдых, экскурсии и авторские маршруты.
          </p>
          <a
            href="#tours"
            className="mt-6 inline-block rounded-full bg-coral-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-coral-600"
          >
            Смотреть горящие туры
          </a>
        </section>

        <section id="tours" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-ocean-900 sm:text-3xl">🔥 Горящие туры</h2>
          </div>
          <TourList tours={tours} />
        </section>
      </main>

      <ContactSection />

      <footer className="bg-ocean-900 py-6 text-center text-sm text-ocean-200">
        © {new Date().getFullYear()} SAYAHAT.travel — все права защищены
      </footer>
    </>
  );
}
