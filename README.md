# SAYAHAT.travel

Сайт турагентства: публичная витрина горящих туров + админ-панель с CRUD.

## Стек

- **Next.js 14** (App Router, TypeScript) — фронтенд и backend (API routes) в одном проекте
- **Tailwind CSS** — адаптивная (mobile-first) вёрстка
- **PostgreSQL + Prisma ORM** — база данных
- **NextAuth.js** (Credentials provider + JWT) — авторизация сотрудников в админке

## Запуск локально

```bash
cp .env.example .env
# впишите DATABASE_URL (локальный Postgres, Supabase или Neon) и сгенерируйте NEXTAUTH_SECRET

npm install
npm run prisma:migrate   # создаст таблицы
npm run seed             # тестовый админ: admin@sayahat.travel / ChangeMe123!
npm run dev
```

Публичная часть: http://localhost:3000
Админ-панель: http://localhost:3000/admin/login

## Структура проекта

```
sayahat-travel/
├── app/
│   ├── page.tsx                     # Главная страница (витрина туров)
│   ├── layout.tsx
│   ├── globals.css
│   ├── admin/
│   │   ├── login/page.tsx           # Авторизация сотрудников
│   │   ├── dashboard/page.tsx       # Список туров + CRUD
│   │   └── tours/
│   │       ├── new/page.tsx         # Создание тура
│   │       └── [id]/edit/page.tsx   # Редактирование тура
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── tours/
│           ├── route.ts             # GET (список) / POST (создать)
│           └── [id]/route.ts        # GET / PUT / DELETE одного тура
├── components/
│   ├── Header.tsx, ContactSection.tsx
│   ├── TourCard.tsx, TourList.tsx
│   └── admin/
│       ├── AdminNav.tsx, TourForm.tsx, DeleteTourButton.tsx
├── lib/
│   ├── prisma.ts      # Prisma client (singleton)
│   ├── auth.ts        # Конфигурация NextAuth
│   └── validations.ts # Zod-схемы + slugify
├── prisma/
│   ├── schema.prisma  # Модели Admin и Tour
│   └── seed.ts
└── middleware.ts      # Защита /admin/* кроме /admin/login
```

## Дальнейшие шаги (production)

- Загрузка файлов изображений (сейчас — поле URL): подключить Supabase Storage / S3 / Cloudinary
- Пагинация в `/api/tours` и на странице туров, если список вырастет
- Роли admin: ограничить удаление только для `OWNER`
- Rate limiting на `/api/auth` и `/api/tours` (POST/PUT/DELETE)
- Логирование и мониторинг ошибок (Sentry)
