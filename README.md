# Portfolio + Supabase Admin

A lightweight, database-driven developer portfolio with a secure admin panel.

**Stack:** React + Vite + Tailwind CSS (frontend) · Express + Zod (backend API) · Supabase/PostgreSQL (database, auth, storage).

## Architecture

```
frontend/   React SPA. Talks to the backend REST API for all data reads and
            writes. Uses the Supabase anon key ONLY for admin sign-in.
backend/    Express REST API. Holds the Supabase service-role key. Verifies
            every admin request server-side (token + ADMIN_EMAIL match)
            before touching the database or storage.
database/   SQL migrations: schema, indexes, RLS policies, storage buckets.
```

The service-role key never reaches the browser. The frontend's Supabase
client is used exclusively for `signInWithPassword` / session management;
every other database interaction goes through the Express API.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy:
   - `Project URL` → used as both `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (backend only — never share this)

## 2. Run the database migrations

In the Supabase dashboard, open **SQL Editor** and run, in order:

1. `database/migrations/0001_init.sql` — tables, indexes, triggers
2. `database/migrations/0002_rls.sql` — Row Level Security policies
3. `database/migrations/0003_storage.sql` — storage buckets + public-read policies

## 3. Create your admin account

There is exactly one authorized admin, gated by email — not by a role flag.

1. In Supabase **Authentication → Users**, click **Add user** and create yourself
   an account with your email + a password (or use "Invite").
2. Set `ADMIN_EMAIL` in `backend/.env` to that exact email (case-insensitive match).
3. Public sign-up is intentionally not implemented anywhere in this app —
   this is the only way to create the admin account.

## 4. Environment variables

Copy `.env.example` to two files:

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

Then fill in:

- `backend/.env` needs: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `PORT`, `CORS_ORIGIN`
- `frontend/.env` needs: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`

Never commit either `.env` file.

## 5. Install & run

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Visit `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the admin panel.

## 6. Populate content

The site is 100% database-driven and ships with an empty database — sections
like Testimonials and Upcoming Project hide themselves until you publish
something. Log into `/admin/login` and go through:

1. **Website Content** — hero/about/contact copy + photos
2. **Settings** — social links, resume PDF upload
3. **Services**, **Skills**, **Resume** (experience/education)
4. **Projects** — add at least one and mark it *Published* to see it live
5. **Reviews** — approve any testimonials you want shown publicly
6. **Enquiries** — where contact-form submissions land

## Production build

```bash
cd frontend && npm run build   # outputs frontend/dist
cd backend && npm start
```

Deploy the backend anywhere that runs Node (Render, Railway, Fly.io, a VPS).
Deploy `frontend/dist` as a static site (Vercel, Netlify, Cloudflare Pages),
pointing `VITE_API_URL` at your deployed backend's `/api` URL and
`CORS_ORIGIN` (backend) at your deployed frontend's origin.

## API overview

Public (no auth):

```
GET  /api/services              GET  /api/skills
GET  /api/resume/experiences    GET  /api/resume/education
GET  /api/projects              GET  /api/projects/:slug
GET  /api/upcoming-projects     GET  /api/reviews
POST /api/reviews               (submit a testimonial — held for approval)
GET  /api/site-content          POST /api/enquiries
```

Admin (Bearer token from Supabase Auth, email must match `ADMIN_EMAIL`):

```
GET  /api/admin/me                          GET  /api/admin/dashboard
GET|POST|PUT|DELETE /api/admin/services     GET|POST|PUT|DELETE /api/admin/skills
GET|POST|PUT|DELETE /api/admin/resume/experiences
GET|POST|PUT|DELETE /api/admin/resume/education
GET|POST|PUT|DELETE /api/admin/projects     POST|DELETE /api/admin/projects/:id/images
GET|POST|PUT|DELETE /api/admin/upcoming-projects
GET /api/admin/reviews  PATCH /api/admin/reviews/:id/approve  DELETE /api/admin/reviews/:id
GET /api/admin/enquiries  PATCH /api/admin/enquiries/:id  DELETE /api/admin/enquiries/:id
GET|PUT /api/admin/site-content
GET|POST|PUT|DELETE /api/admin/site-content/social-links
POST /api/admin/upload/:bucket   (multipart "file" field)
```

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` only ever lives in `backend/.env` — it is
  never imported by any frontend file.
- Every `/api/admin/*` route re-verifies the Supabase access token AND
  checks the token's email against `ADMIN_EMAIL` server-side
  (`backend/src/middleware/auth.js`). The frontend's own "is logged in"
  check is UX only and grants no real access.
- All input is validated with Zod on the backend (`backend/src/validators`);
  frontend validation is for UX only.
- The public contact form and testimonial-submission endpoints are
  rate-limited (5 requests / 15 min per IP) to prevent spam/flooding.
- RLS is enabled on every table as defense-in-depth even though the primary
  data path (via the Express backend) uses the service-role key, which
  bypasses RLS — this protects against any future direct anon-key access.
- File uploads are validated by MIME type and size server-side before
  reaching Supabase Storage; upload endpoints require admin auth.
