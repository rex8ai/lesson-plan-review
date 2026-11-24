# Lesson Plan Response Tester

Next.js app that loads lesson-plan API responses (stored as JSON) from Supabase Postgres and lets you review any number of sections with per-section feedback.

Each response is identified by a **UUID**. The **name** is a free-form label (`response v3`, `response on 23 Nov`, etc.) and is not unique.

- Tester: `/`
- Admin (add / edit / rename / delete responses): `/admin`

## Setup

1. Copy env:

```bash
cp .env.example .env.local
```

2. Set `DATABASE_URL` to your Supabase **pooler** connection string (required for Vercel serverless).

3. Install & seed:

```bash
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/admin](http://localhost:3000/admin).

## Vercel

1. Import the repo in Vercel (Next.js is auto-detected).
2. Add **Production / Preview / Development** env var:
   - `DATABASE_URL` = Supabase **transaction pooler** URL  
     (`...@aws-0-<region>.pooler.supabase.com:6543/postgres`)
3. Deploy.

App Router APIs under `app/api/**` run as Node.js serverless functions:

- `GET/POST /api/responses`
- `GET/PUT/DELETE /api/responses/[id]`
- `GET /api/feedback/[responseId]`
- `PUT /api/feedback/[responseId]/[sectionKey]`

Admin UI: `/admin` (not linked from the tester toolbar).
