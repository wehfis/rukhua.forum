# RukhUA Forum

Official information portal scaffold for the public organization "Громадський рух розвитку України".

## Stack

- Next.js 15 App Router, React 19, TypeScript
- TailwindCSS with shadcn/ui-style primitives
- next-intl with `/uk`, `/en`, `/de`, `/fr`, `/it`
- Supabase Auth and Supabase PostgreSQL via Drizzle ORM
- S3 presigned uploads with a CloudFront-ready asset base URL
- Tiptap JSON editor for admin post content

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/uk`.

Admin routes are protected by Supabase Auth. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `DATABASE_URL`, then create an administrator account in Supabase before using `/uk/admin`.

## Database

Generate migrations from the Drizzle schema:

```bash
npm run db:generate
npm run db:migrate
```

Core tables are `users`, `posts`, `comments`, and `likes`, with prepared tables for categories, tags, departments, documents, and post/tag relations.

## Internationalization

Translations live in `messages/*.json`. To add a language:

1. Add `messages/es.json`.
2. Register `es` in `src/i18n/routing.ts`.

No page code needs to change for static site copy.

## Media

Uploads are signed through `/api/uploads/presign`. Object keys are scoped to:

- `posts/`
- `documents/`
- `uploads/`
- `avatars/`

Set `NEXT_PUBLIC_ASSET_BASE_URL` to a CloudFront distribution later without changing application code.
