# TOOF Foundation — Fullstack App

A Vite + React frontend with a Convex backend for the TOOF Foundation. It includes authentication and roles, blogs with media storage, events and registrations, a gallery, and a password reset flow with email delivery via Brevo.

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- Backend: Convex (functions, database, storage, HTTP routes)
- Deployment: Vercel (frontend) + Convex (backend)

## Repository Layout

```
.
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   └── package.json
├── backend/
│   ├── convex/
│   │   ├── auth.ts
│   │   ├── blogs.ts
│   │   ├── events.ts
│   │   ├── gallery.ts
│   │   ├── passwordReset.ts
│   │   ├── http.ts
│   │   ├── schema.ts
│   │   └── README.md
│   └── CONVEX_SETUP.md
├── package.json (root workspace config)
├── vercel.json
└── README.md
```

Key files

- Frontend app: [frontend/src](frontend/src), [frontend/public](frontend/public), [frontend/index.html](frontend/index.html)
- Backend (Convex): [backend/convex](backend/convex), [backend/convex/README.md](backend/convex/README.md)
- Workspace config: [package.json](package.json)
- Deployment: [vercel.json](vercel.json)

Backend modules ([backend/convex](backend/convex))

- Auth & roles: [auth.ts](backend/convex/auth.ts)
- Blogs: [blogs.ts](backend/convex/blogs.ts)
- Events & registrations: [events.ts](backend/convex/events.ts)
- Gallery: [gallery.ts](backend/convex/gallery.ts)
- Password reset flow: [passwordReset.ts](backend/convex/passwordReset.ts)
- HTTP email endpoint (Brevo): [http.ts](backend/convex/http.ts)
- Schema & indexes: [schema.ts](backend/convex/schema.ts)

Frontend pages/components ([frontend/src](frontend/src))

- Pages: [pages](frontend/src/pages) (Blog, Events, Contact, Admin, etc.)
- Admin tools: [components/admin](frontend/src/components/admin)
- App entry: [main.tsx](frontend/src/main.tsx), [App.tsx](frontend/src/App.tsx)

## Quick Start

1. Install dependencies (repo root):

```bash
npm install
```

2. Start Convex (backend) from repo root:

```bash
npm run backend:dev
```

This opens Convex locally and prints a dev URL (VITE_CONVEX_URL).

3. Start the frontend (in another terminal) from repo root:

```bash
npm run dev
```

4. Open the app at the URL Vite prints (usually http://localhost:8080).

## Environment Variables

Create `.env.local` in the repo root for the frontend:

```bash
VITE_CONVEX_URL=<your-convex-dev-or-prod-url>
VITE_CLERK_PUBLISHABLE_KEY=<optional-if-using-clerk>
```

Configure Convex environment variables (Convex Dashboard → Settings → Environment) for email:

- `BREVO_API_KEY` (required for password reset emails)
- `BREVO_SENDER_EMAIL` (optional; default: shawolhorizon@gmail.com)
- `BREVO_SENDER_NAME` (optional; default: The Olanike Omopariola Foundation)

## Development

From repo root:

- Frontend dev server:

```bash
npm run dev
```

- Backend dev server:

```bash
npm run backend:dev
```

- Build and local preview:

```bash
npm run build
npm run preview
```

## Features Overview

- **Auth & Roles**
  - Sign up / Sign in in [backend/convex/auth.ts](backend/convex/auth.ts)
  - Role management (admin/user), with bootstrap admin helper
- **Blogs**
  - Posts with title, slug, excerpt, tags; featured images and optional large content storage in [backend/convex/blogs.ts](backend/convex/blogs.ts)
- **Events**
  - Events with status, dates, capacity; registrations in [backend/convex/events.ts](backend/convex/events.ts)
- **Gallery**
  - Categorized image collections in [backend/convex/gallery.ts](backend/convex/gallery.ts)
- **Password Reset**
  - OTP flow: request/verify/reset in [backend/convex/passwordReset.ts](backend/convex/passwordReset.ts)
  - Email HTTP route in [backend/convex/http.ts](backend/convex/http.ts)

## Password Reset Email Endpoint

The Convex HTTP action exposes `POST /send-reset-email` on your Convex domain. Body:

```json
{ "email": "user@example.com", "code": "123456" }
```

Ensure Convex env var `BREVO_API_KEY` is set.

## Data Model (Summary)

See full definitions in [backend/convex/schema.ts](backend/convex/schema.ts):

- `users` (indexed by email) with `role`, timestamps
- `blogs` (indexes: author, slug, status) with optional storage IDs
- `events` (indexes: organizer, slug, status, start_date)
- `gallery` (indexes: category, created_by)
- `event_registrations` (indexes: event, user_email)
- `password_reset_tokens` (indexes: email, code)

## Security Notes

- Password hashing in dev is a simple base64 helper. Replace with a strong hash (bcrypt/argon2) for production and migrate stored hashes.
- `bootstrapAdmin` uses a hard‑coded secret in [backend/convex/auth.ts](backend/convex/auth.ts). Move this to a Convex environment variable before deploying.
- Validate and sanitize user content in both frontend and backend (see [frontend/src/lib/sanitize.ts](frontend/src/lib/sanitize.ts)).

## Scripts

From root [package.json](package.json):

```bash
npm run dev            # Start Vite dev server (frontend)
npm run build          # Production build (frontend)
npm run build:dev      # Development-mode build (frontend)
npm run preview        # Preview built app (frontend)
npm run backend:dev    # Start Convex dev server
npm run backend:deploy # Deploy Convex backend
```

Useful Convex commands (from `backend/` folder or repo root):

```bash
npx convex dev
npx convex deploy
npx convex env set BREVO_API_KEY <value>
npx convex env list
```

## Deployment

- **Frontend (Vercel)**
  - Connect repository to Vercel
  - Set `VITE_CONVEX_URL` (and other `VITE_...` vars) in Vercel Project Settings
  - The build should follow [vercel.json](vercel.json) and Vite defaults
- **Backend (Convex)**
  - Deploy from `backend/` folder or repo root with:
    ```bash
    npx convex deploy
    ```
  - Set production Convex env vars (e.g., `BREVO_API_KEY`)

## Troubleshooting

- Frontend can't reach Convex: ensure `VITE_CONVEX_URL` matches `npm run backend:dev` output.
- Email not sending: check `BREVO_API_KEY` in Convex env and Convex logs for the HTTP action.
- Permissions: confirm an admin exists; review bootstrap flow in [backend/convex/auth.ts](backend/convex/auth.ts).
- Type errors: make sure dependencies are installed and you're on Node 18+.

---

For backend‑specific details, see [backend/convex/README.md](backend/convex/README.md).
