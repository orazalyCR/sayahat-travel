import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Защищаем страницы /admin (кроме /admin/login).
// API /api/tours остаётся доступным по GET для публичной части сайта —
// запись (POST/PUT/DELETE) проверяется внутри самих route-хендлеров через getServerSession.
export const config = {
  matcher: ["/admin/((?!login).*)"],
};
