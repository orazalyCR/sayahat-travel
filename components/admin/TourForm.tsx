"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tour } from "@prisma/client";

type TourFormValues = {
  title: string;
  shortDescription: string;
  description: string;
  country: string;
  city: string;
  price: string;
  oldPrice: string;
  currency: string;
  startDate: string;
  endDate: string;
  durationDays: string;
  imageUrl: string;
  isHot: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  whatsappOverride: string;
};

function toDateInputValue(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

function toFormValues(tour?: Tour): TourFormValues {
  if (!tour) {
    return {
      title: "",
      shortDescription: "",
      description: "",
      country: "",
      city: "",
      price: "",
      oldPrice: "",
      currency: "KZT",
      startDate: "",
      endDate: "",
      durationDays: "",
      imageUrl: "",
      isHot: false,
      status: "DRAFT",
      whatsappOverride: "",
    };
  }

  return {
    title: tour.title,
    shortDescription: tour.shortDescription,
    description: tour.description,
    country: tour.country,
    city: tour.city ?? "",
    price: String(tour.price),
    oldPrice: tour.oldPrice ? String(tour.oldPrice) : "",
    currency: tour.currency,
    startDate: toDateInputValue(tour.startDate),
    endDate: toDateInputValue(tour.endDate),
    durationDays: String(tour.durationDays),
    imageUrl: tour.imageUrl,
    isHot: tour.isHot,
    status: tour.status,
    whatsappOverride: tour.whatsappOverride ?? "",
  };
}

export default function TourForm({ tour }: { tour?: Tour }) {
  const router = useRouter();
  const isEdit = Boolean(tour);
  const [values, setValues] = useState<TourFormValues>(() => toFormValues(tour));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof TourFormValues>(key: K, value: TourFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...values,
      city: values.city || null,
      oldPrice: values.oldPrice ? Number(values.oldPrice) : null,
      price: Number(values.price),
      durationDays: Number(values.durationDays),
      whatsappOverride: values.whatsappOverride || null,
    };

    const res = await fetch(isEdit ? `/api/tours/${tour!.id}` : "/api/tours", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Не удалось сохранить тур");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-ocean-800">Заголовок тура</label>
        <input
          required
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          placeholder="Анталия, 7 ночей — всё включено"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800">Краткое описание (для карточки)</label>
        <textarea
          required
          rows={2}
          value={values.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800">Полное описание</label>
        <textarea
          required
          rows={5}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ocean-800">Страна</label>
          <input
            required
            value={values.country}
            onChange={(e) => update("country", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-800">Город</label>
          <input
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ocean-800">Цена</label>
          <input
            required
            type="number"
            min={0}
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-800">Цена до скидки</label>
          <input
            type="number"
            min={0}
            value={values.oldPrice}
            onChange={(e) => update("oldPrice", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-800">Валюта</label>
          <input
            required
            value={values.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ocean-800">Дата начала</label>
          <input
            required
            type="date"
            value={values.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-800">Дата окончания</label>
          <input
            required
            type="date"
            value={values.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ocean-800">Дней</label>
          <input
            required
            type="number"
            min={1}
            value={values.durationDays}
            onChange={(e) => update("durationDays", e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800">URL изображения</label>
        <input
          required
          type="url"
          value={values.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
        />
        {values.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.imageUrl}
            alt="Превью"
            className="mt-2 h-32 w-full rounded-lg object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800">
          Ссылка на WhatsApp (необязательно — иначе используется общий номер агентства)
        </label>
        <input
          value={values.whatsappOverride}
          onChange={(e) => update("whatsappOverride", e.target.value)}
          placeholder="https://wa.me/77001234567?text=..."
          className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 focus:border-coral-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-ocean-800">
          <input
            type="checkbox"
            checked={values.isHot}
            onChange={(e) => update("isHot", e.target.checked)}
            className="h-4 w-4 rounded border-ocean-300 text-coral-500 focus:ring-coral-500"
          />
          🔥 Горящий тур (показывать в топе на главной)
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-ocean-800">
          Статус
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value as TourFormValues["status"])}
            className="rounded-lg border border-ocean-200 px-2 py-1"
          >
            <option value="DRAFT">Черновик</option>
            <option value="PUBLISHED">Опубликован</option>
            <option value="ARCHIVED">В архиве</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-coral-500 px-5 py-2.5 font-semibold text-white hover:bg-coral-600 disabled:opacity-60"
        >
          {loading ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Создать тур"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="rounded-lg border border-ocean-200 px-5 py-2.5 font-medium text-ocean-700 hover:bg-ocean-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
