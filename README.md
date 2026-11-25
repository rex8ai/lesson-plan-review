# Lesson Plan Response Tester

Next.js app that loads lesson-plan API responses (stored as JSON) from Supabase Postgres so a team can review them section by section and leave comments.

- **Versions** group responses that are reviewed together (`v0`, `v1`, …). Everything that existed before versioning lives in `v0`. Each version holds many responses.
- **Responses** are identified by a UUID. The **name** is a free-form label (`response v3`, `response on 23 Nov`, …).
- **Comments** are append-only notes on a section or on the whole lesson plan. The comment box is always empty; each comment is stored with the reviewer's name and time.

Pages:

- Tester `/` – pick a version, pick a response, comment. The URL (`?version=…&response=…`) is shareable.
- Admin `/admin` – add / edit / move / delete responses. The **Version** dropdown picks an existing version or `＋ Create new version…`.

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

- `GET/POST /api/versions` – list (with counts) / create (blank name → next `vN`)
- `DELETE /api/versions/[id]` – only empty versions, never `v0`
- `GET /api/responses[?versionId=]` – list without payload, with comment counts
- `POST /api/responses` – `{ name, payload, versionId }` (payload is validated)
- `GET/PUT/DELETE /api/responses/[id]` – `PUT` accepts `name`, `payload`, `versionId` (move)
- `GET/POST /api/responses/[id]/comments` – `POST { sectionKey, sectionTitle, author, body }`
- `DELETE /api/responses/[id]/comments/[commentId]`

The schema migrates itself on the first request (`lib/migrate.js`, one transaction + advisory lock):
existing responses go to `v0`, and old per-section feedback text is converted into comments (a leading
`name:` becomes the author) and kept in `section_feedback_legacy`.

Admin UI: `/admin` (not linked from the tester toolbar).

`npm run seed` loads the demo responses into `v0`.
