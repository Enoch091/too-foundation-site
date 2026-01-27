TOOF Foundation — Convex Backend

Overview

- Convex backend for the TOOF Foundation site. It provides user auth and roles, blogs with media storage, events and registrations, a gallery, and a password reset flow with an HTTP email endpoint.

Key Features

- Auth: `signup`, `signin`, admin bootstrap and role management in [auth.ts](auth.ts).
- Blogs: CRUD with slugs, tags, featured images, and optional large content storage in [blogs.ts](blogs.ts).
- Events: Events with status, dates, capacity, and registrations in [events.ts](events.ts).
- Gallery: Categorized image collections in [gallery.ts](gallery.ts).
- Password Reset: 6‑digit OTP flow (`requestPasswordReset`, `verifyResetCode`, `resetPassword`) in [passwordReset.ts](passwordReset.ts).
- HTTP Email Endpoint: `/send-reset-email` via Brevo in [http.ts](http.ts).
- Schema: All tables and indexes defined in [schema.ts](schema.ts).

Prerequisites

- Node.js 18+ and npm.
- Convex account and CLI (use `npx convex ...` or install globally).
- A Brevo API key if you want to send password reset emails.

Install Dependencies

```bash
npm install
```

Local Development

1. Start Convex (prompts login/initialization if needed):

```bash
npx convex dev
```

This prints a dev `VITE_CONVEX_URL` you’ll use in the frontend.

2. In another terminal, start the frontend (repo root):

```bash
npm run dev
```

Environment Configuration

- Frontend config lives in [src/config/convex.ts](../src/config/convex.ts).
- Create an `.env.local` at the repo root and set:

```bash
VITE_CONVEX_URL=<your-convex-dev-or-prod-url>
VITE_CLERK_PUBLISHABLE_KEY=<optional-if-using-clerk>
```

Email (Password Reset)

- The HTTP action in [http.ts](http.ts) sends emails via Brevo.
- Configure Convex environment variables (Console → Settings → Environment):
  - `BREVO_API_KEY` (required)
  - `BREVO_SENDER_EMAIL` (optional, default: `shawolhorizon@gmail.com`)
  - `BREVO_SENDER_NAME` (optional, default: `The Olanike Omopariola Foundation`)

Data Model (Summary)

- Users: email, name, `password_hash`, `role` (admin/user), timestamps; index by email.
- Blogs: title, slug, excerpt, tags, status; optional content/image storage IDs; indexes by author, slug, status.
- Events: title, slug, dates, location, capacity, registrations; indexes by organizer, slug, status, start_date.
- Gallery: images array (url, storage_id, alt_text), category, featured; indexes by category and creator.
- Event registrations: event_id, user info; indexes by event and email.
- Password reset tokens: email, 6‑digit code, expiry, attempts, used; indexes by email and code.
  See full definitions in [schema.ts](schema.ts).

Client Usage Notes

- The generated client is under [convex/\_generated](./_generated/). Import `api` and call queries/mutations via the Convex client or React hooks.
- Example (pseudo‑usage):

```ts
import { api } from "../convex/_generated/api";
// client.mutation(api.auth.signup, { email, name, password })
// client.query(api.auth.getCurrentUser, { email })
```

Security Notes

- Password hashing is currently a simple Base64 helper for development. For production, replace with a strong hash (e.g., bcrypt/argon2) and migrate existing hashes.
- `bootstrapAdmin` uses a hard‑coded secret. Move it to an environment variable before deploying.

Common Commands

```bash
# Start local Convex dev
npx convex dev

# Deploy Convex (from repo root or convex dir)
npx convex deploy

# Set/read Convex env vars
npx convex env set BREVO_API_KEY <value>
npx convex env list
```

Deployment

- Deploy Convex with `npx convex deploy` and configure production env vars (Brevo + any secrets).
- The repo includes [vercel.json](../vercel.json) for frontend hosting; ensure `VITE_CONVEX_URL` is set in Vercel project settings.

Troubleshooting

- Frontend can’t reach Convex: verify `VITE_CONVEX_URL` matches the `convex dev` printed URL.
- Email not sending: ensure `BREVO_API_KEY` is set in Convex env and check Convex logs.
- Permission issues: verify admin role assignment and the bootstrap flow in [auth.ts](auth.ts).
