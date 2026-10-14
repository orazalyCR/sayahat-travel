import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import TourForm from "@/components/admin/TourForm";

export default async function EditTourPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const tour = await prisma.tour.findUnique({ where: { id: params.id } });

  if (!tour) notFound();

  return (
    <div className="min-h-screen bg-ocean-50">
      <AdminNav adminName={session?.user?.name ?? "Сотрудник"} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-xl font-bold text-ocean-900 sm:text-2xl">Редактировать тур</h1>
        <TourForm tour={tour} />
      </main>
    </div>
  );
}
