"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ocean-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ocean-100"
      >
        <h1 className="mb-1 text-xl font-bold text-ocean-900">Вход в админ-панель</h1>
        <p className="mb-6 text-sm text-ocean-600">SAYAHAT.travel — только для сотрудников</p>

        <label className="mb-3 block text-sm font-medium text-ocean-800">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 outline-none focus:border-coral-500"
          />
        </label>

        <label className="mb-4 block text-sm font-medium text-ocean-800">
          Пароль
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ocean-200 px-3 py-2 outline-none focus:border-coral-500"
          />
        </label>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-coral-500 px-4 py-2 font-semibold text-white transition hover:bg-coral-600 disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
