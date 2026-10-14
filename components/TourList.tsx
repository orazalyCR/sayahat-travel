import type { Tour } from "@prisma/client";
import TourCard from "./TourCard";

/**
 * Отображает сетку туров. Server Component — получает уже готовый массив
 * туров (см. app/page.tsx, где они загружаются напрямую из Prisma).
 */
export default function TourList({ tours }: { tours: Tour[] }) {
  if (tours.length === 0) {
    return (
      <p className="py-12 text-center text-ocean-600">
        Пока нет активных предложений — загляните чуть позже или напишите нам напрямую.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
