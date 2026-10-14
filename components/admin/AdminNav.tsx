"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminNav({ adminName }: { adminName: string }) {
  return (
    <header className="flex items-center justify-between border-b border-ocean-100 bg-white px-4 py-3 sm:px-6">
      <Link href="/admin/dashboard" className="font-bold text-ocean-800">
        SAYAHAT — Админ-панель
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-ocean-600">{adminName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="rounded-lg border border-ocean-200 px-3 py-1.5 font-medium text-ocean-700 hover:bg-ocean-50"
        >
          Выйти
        </button>
      </div>
    </header>
  );
}
