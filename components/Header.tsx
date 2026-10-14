import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-ocean-700 sm:text-xl">
          SAYAHAT<span className="text-coral-500">.travel</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ocean-700 sm:flex">
          <a href="#tours" className="hover:text-coral-500">Горящие туры</a>
          <a href="#contacts" className="hover:text-coral-500">Контакты</a>
        </nav>
        <a
          href="#contacts"
          className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-600 sm:px-5"
        >
          Связаться
        </a>
      </div>
    </header>
  );
}
