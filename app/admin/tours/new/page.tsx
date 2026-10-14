import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import TourForm from "@/components/admin/TourForm";

export default async function NewTourPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-ocean-50">
      <AdminNav adminName={session?.user?.name ?? "Сотрудник"} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-xl font-bold text-ocean-900 sm:text-2xl">Новый тур</h1>
        <TourForm />
      </main>
    </div>
  );
}
