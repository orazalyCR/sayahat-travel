import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import DeleteTourButton from "@/components/admin/DeleteTourButton";

const priceFormatter = new Intl.NumberFormat("ru-RU");
const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" });

const statusLabel: Record<string, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликован",
  ARCHIVED: "В архиве",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-ocean-50">
      <AdminNav adminName={session?.user?.name ?? "Сотрудник"} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-ocean-900 sm:text-2xl">Туры ({tours.length})</h1>
          <Link
            href="/admin/tours/new"
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-600"
          >
            + Новый тур
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-ocean-100">
          <table className="min-w-full divide-y divide-ocean-100 text-sm">
            <thead className="bg-ocean-50 text-left text-ocean-600">
              <tr>
                <th className="px-4 py-3">Тур</th>
                <th className="px-4 py-3">Даты</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-50">
              {tours.map((tour) => (
                <tr key={tour.id}>
                  <td className="px-4 py-3 font-medium text-ocean-900">
                    {tour.isHot && "🔥 "}
                    {tour.title}
                  </td>
                  <td className="px-4 py-3 text-ocean-600">
                    {dateFormatter.format(tour.startDate)} – {dateFormatter.format(tour.endDate)}
                  </td>
                  <td className="px-4 py-3 text-ocean-600">
                    {priceFormatter.format(Number(tour.price))} {tour.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-ocean-100 px-2 py-1 text-xs font-semibold text-ocean-700">
                      {statusLabel[tour.status] ?? tour.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/tours/${tour.id}/edit`} className="text-ocean-600 hover:underline">
                        Редактировать
                      </Link>
                      <DeleteTourButton tourId={tour.id} tourTitle={tour.title} />
                    </div>
                  </td>
                </tr>
              ))}

              {tours.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ocean-500">
                    Туров пока нет — создайте первый.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
