# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

Craft & Code Club Blog (`blog-v2`) is a **Next.js 16 static-export** community site. Content lives in `_content/` as Markdown/YAML; there is no backend, database, or required environment variables.

## Cursor Cloud specific instructions

### Services

| Service | Required | Notes |
|---------|----------|-------|
| Next.js dev server | Yes | Primary development workflow |
| Docker/nginx | No | Optional production-like static serving |
| Database/API | No | Not used |

### Commands

Standard commands are in `package.json` and `README.md`:

- **Install:** `npm ci` (preferred; matches CI) or `npm install`
- **Dev:** `npm run dev` → http://localhost:3000 (uses Turbopack)
- **Build:** `npm run build` → static output in `out/`
- **Roadmap validation:** `npx tsx scripts/validate-roadmap.ts`

### Lint caveat

`npm run lint` (`next lint`) **does not work** on Next.js 16.2.7 — the `lint` subcommand was removed from the Next.js CLI. CI only runs `npm run build`, not lint. Do not treat lint failure as a blocker unless the script is updated upstream.

### Tests

There is no `npm test` script and no unit test suite in this repo. Verification is via `npm run build` and the roadmap validator.

### Node version

CI uses **Node 20** (`.github/workflows/cloudflare-pages-deploy.yml`). Node 22 also works for local dev/build.

### Docker note

`docker-compose.yml` references `Dockerfile`, but the repo file is named `dockerfile` (lowercase). On Linux this can break `docker compose up --build`. Prefer `npm run dev` for local development.

### Key routes to smoke-test

`/`, `/blog`, `/posts/dsa-skip-list`, `/events`, `/roadmap/dsa`, `/topics`
