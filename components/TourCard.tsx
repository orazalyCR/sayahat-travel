import Image from "next/image";
import type { Tour } from "@prisma/client";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "77001234567";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" });
const priceFormatter = new Intl.NumberFormat("ru-RU");

function buildWhatsappLink(tour: Tour) {
  if (tour.whatsappOverride) return tour.whatsappOverride;
  const text = `Здравствуйте! Интересует тур «${tour.title}» (${dateFormatter.format(
    tour.startDate
  )} – ${dateFormatter.format(tour.endDate)}).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function TourCard({ tour }: { tour: Tour }) {
  const hasDiscount = tour.oldPrice && Number(tour.oldPrice) > Number(tour.price);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ocean-100 transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-ocean-50">
        <Image
          src={tour.imageUrl}
          alt={tour.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {tour.isHot && (
          <span className="absolute left-3 top-3 rounded-full bg-coral-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
            🔥 Горящий тур
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-bold text-ocean-900">{tour.title}</h3>
        <p className="line-clamp-2 text-sm text-ocean-700/80">{tour.shortDescription}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ocean-600">
          <span>📍 {[tour.city, tour.country].filter(Boolean).join(", ")}</span>
          <span>
            📅 {dateFormatter.format(tour.startDate)} – {dateFormatter.format(tour.endDate)}
          </span>
          <span>🕒 {tour.durationDays} дн.</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            {hasDiscount && (
              <div className="text-sm text-ocean-400 line-through">
                {priceFormatter.format(Number(tour.oldPrice))} {tour.currency}
              </div>
            )}
            <div className="text-xl font-extrabold text-ocean-900">
              {priceFormatter.format(Number(tour.price))} {tour.currency}
            </div>
          </div>

          <a
            href={buildWhatsappLink(tour)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-600"
          >
            Забронировать
          </a>
        </div>
      </div>
    </article>
  );
}
