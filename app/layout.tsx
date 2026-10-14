import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAYAHAT.travel — горящие туры",
  description: "Турагентство SAYAHAT — горящие туры, пляжный отдых и путешествия мечты.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen text-ocean-900 antialiased">{children}</body>
    </html>
  );
}
