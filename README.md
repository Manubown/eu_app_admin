# EU_Base-App Admin

Central admin dashboard for the EU_Base-App portfolio (Grätzl, Stromoclock, Bubbleboard, Kleinrechnung, …).

One page lists every product with:

- Live health dot (pings the deployed URL)
- Deep links to Vercel, Supabase, GitHub repo, and the live site
- Per-project detail page with recent Vercel deployments + Supabase project status

Read-only. Designed as a navigation hub — actual configuration still happens on each service's own dashboard.

## Stack

| Layer            | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Frontend         | Next.js 16 (App Router) + React 19 + TypeScript   |
| Styling          | Tailwind CSS v4                                   |
| Auth             | NextAuth v5 (Auth.js) + GitHub OAuth + email allowlist |
| Integrations     | Vercel REST API, Supabase Management API          |
| Hosting          | Vercel                                            |

## Getting started

```bash
pnpm install
cp .env.example .env.local
# Fill in the values described below
pnpm dev
```

Open <http://localhost:3000> — you should be redirected to `/signin`.

## Environment variables

See [`.env.example`](./.env.example) for the full list. Summary:

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | NextAuth session secret. `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth App credentials |
| `ADMIN_ALLOWED_EMAILS` | Comma-separated allowlist (e.g. `manubown@gmail.com`) |
| `VERCEL_TOKEN` | Personal token from <https://vercel.com/account/tokens> |
| `VERCEL_TEAM_ID` | Optional — scope to a team |
| `SUPABASE_ACCESS_TOKEN` | Management API token from <https://supabase.com/dashboard/account/tokens> |

### Creating the GitHub OAuth App

1. <https://github.com/settings/developers> → **New OAuth App**
2. Homepage: `http://localhost:3000` (or your prod URL)
3. Authorization callback: `http://localhost:3000/api/auth/callback/github`
4. Generate a client secret. Copy both into `.env.local`.

For production, add a second callback URL pointing at the Vercel domain.

## Adding / updating a project

Projects live in [`src/lib/projects.ts`](./src/lib/projects.ts). Each entry maps a slug to:

- `vercelProjectName` — used to look the project up via the Vercel API and to build the dashboard deep-link
- `supabaseProjectRef` — the 20-char ref from the Supabase project URL
- `liveUrl` — used by the health pinger
- `repoUrl` — GitHub link

The registry ships pre-populated with placeholder values; fill in URLs/IDs as each project goes live.

## Deploying to Vercel

```bash
vercel --prod
```

Then in the Vercel project settings, add every env var from `.env.example`. Add the production callback URL to the GitHub OAuth App.

## What this app deliberately does NOT do

- **No write actions.** No "redeploy" or "rollback" buttons. Click through to Vercel for that.
- **No DB row editing.** Click through to Supabase Studio.
- **No persisted log.** Recent activity is read live from Vercel each request.

If you want to add write capabilities later, the integration wrappers in `src/lib/{vercel,supabase}.ts` already authenticate — just extend them.
