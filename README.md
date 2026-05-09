## Portfolio Hub

Centralized portfolio launcher with **Supabase Auth + role-based access**.

### Tech stack
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- **Auth/DB**: Supabase (Auth + Postgres + RLS + Storage)

## Getting started

### 1) Install

```bash
npm install
```

### 2) Create Supabase project
- Create a new Supabase project
- Enable **Email/Password** auth
- Run the SQL migration:
  - `supabase/migrations/001_init.sql`
  - `supabase/migrations/002_profile_trigger.sql` (auto-creates `profiles` row on signup)

### 3) Configure environment
- Copy `.env.example` → `.env.local`
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4) Storage bucket (thumbnails)
Create a bucket named:
- `portfolio-thumbnails`

Then configure Storage policies so **admins can upload** (and optionally authenticated users can read). The UI currently uploads thumbnails to that bucket.

### 5) Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## App routes
- `/login`: login screen
- `/`: employee dashboard (portfolios grid)
- `/admin`: admin landing (admin-only)
- `/admin/portfolios`: admin portfolios list (admin-only)
- `/admin/portfolios/new`: create portfolio (admin-only)
- `/admin/portfolios/[id]/edit`: edit portfolio (admin-only)

## Deployment (Vercel)
- Deploy the Next.js app to Vercel
- Add the same env vars in Vercel Project Settings
- In Supabase Auth settings, add your Vercel domain(s) to allowed redirect URLs as needed

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
