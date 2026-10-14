"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTourButton({ tourId, tourTitle }: { tourId: string; tourTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Удалить тур «${tourTitle}»? Действие необратимо.`)) return;

    setLoading(true);
    const res = await fetch(`/api/tours/${tourId}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Не удалось удалить тур");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Удаление…" : "Удалить"}
    </button>
  );
}
