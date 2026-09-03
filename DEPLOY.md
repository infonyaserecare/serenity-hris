# Deploy — Serenity HRIS → Cloudflare Pages

Same shape as the RMA portal deploy: **local → GitHub → Cloudflare Pages
(git‑connected auto‑deploy)**. HRIS is simpler — it is a pure static build with
**no backend, no environment variables, and no secrets**, so there is nothing
to protect and nothing server‑side to move.

```
git push  →  GitHub  →  Cloudflare Pages build (npm run build)  →  https://<project>.pages.dev
```

## 1. Build audit (done)

| Item | Result |
|---|---|
| Framework | Vite 5 + React 18 (`@vitejs/plugin-react`) |
| Package manager | npm (`package-lock.json` present) |
| Build command | `npm run build` |
| Output directory | `dist/` |
| Server runtime needed | **No** — 100 % static, client‑side only |
| Serverless functions / API routes | None |
| Environment variables | **None** |
| Secrets in the bundle | None |
| External runtime calls | Google Fonts stylesheet only (client‑side, has a system‑font fallback) |
| SPA routing | No router; `dist/_redirects` sends every path to `index.html` anyway |
| Extra output files | `dist/_headers` (security + asset caching), `dist/_redirects` |

`npm run build` was run and the built `dist/` was served and smoke‑tested
(auth screen → sign in as `sri.wahyuni` → dashboard renders, zero JS console
errors; the only failed request in the offline sandbox was Google Fonts,
which resolves on a real network).

## 2. GitHub

```bash
cd E:/APPS/HRIS
git init -b main
git add .
git commit -m "chore: prepare Serenity HRIS prototype for Cloudflare Pages"

# create the repo (choose the name + visibility), then:
git remote add origin https://github.com/<org>/<repo>.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `dist/`, `*.zip`, and the two
abandoned scaffolds (`hris-serenity/`, `serenity-hris-backend/`).

## 3. Cloudflare (git‑connected)

**Dashboard → Workers & Pages → Create → Connect to Git**, pick
`infonyaserecare/serenity-hris`, then:

| Field | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Environment variables | *(none)* |
| Node version | 20 (also pinned by `.node-version`) |

The unified dashboard creates this as a **Worker with static assets** (not a
classic Pages project). That is fine for a static site — same result, URL is
`serenity-hris.<account-subdomain>.workers.dev`.

`wrangler.jsonc` in the repo root does the actual configuration:

```jsonc
{
  "name": "serenity-hris",
  "compatibility_date": "2026-09-03",
  "assets": { "directory": "./dist", "not_found_handling": "single-page-application" }
}
```

It is **assets‑only** (no `main` Worker script) so `wrangler deploy` just
uploads `./dist`. Without this file, `wrangler deploy` tries to auto‑wire the
Cloudflare Vite plugin, which needs Vite ≥ 6 — this project is on Vite 5, so
that path fails with:
`The version of Vite used in the project ("5.4.21") cannot be automatically configured.`

`public/_headers` and `public/_redirects` (copied into `dist/` by Vite) are
honoured by Workers static assets too.

Every `git push` to `main` rebuilds and deploys; other branches get a preview.

### Alternative: direct upload from a workstation

```bash
npm run build
npx --yes wrangler@4 deploy      # uses wrangler.jsonc
# needs a logged-in wrangler (`wrangler login`) or:
#   CLOUDFLARE_API_TOKEN  (Workers Scripts: Edit)  +  CLOUDFLARE_ACCOUNT_ID
```

`npm run deploy` runs `vite build` then `npx wrangler deploy`.

## 4. Verify the deployment (not just the homepage)

- [ ] `https://<project>.pages.dev` loads the sign‑in screen
- [ ] Sign in as `sri.wahyuni` (any password) → HR dashboard renders
- [ ] `andi.pratama` (Employee), `agus.setiawan` (Accounting), `maya.puspita`
      (Manager), `dimas.wijaya` (Supervisor) — any password — each lands on a
      role‑correct dashboard
- [ ] Theme toggle (light / dark / system) and language toggle (ID / EN) work
- [ ] Attendance module: every tab opens; Weekly Review finalise → lock works
- [ ] Browser console has no errors (Inter font should now load)
- [ ] Mobile width (375 px): sidebar collapses to a drawer, no horizontal scroll
- [ ] A deep path (e.g. `/anything`) still serves the app (via `_redirects`)

## 5. Custom domain (optional, later)

Pages project → **Custom domains** → add e.g. `hris.<domain>` (a CNAME Cloudflare
manages). Do this only after the `*.pages.dev` URL is verified. Nothing about the
app changes.

## 6. Rollback

Cloudflare Pages keeps every deployment. **Deployments → pick a previous one →
Rollback.** There is no database or DNS to unwind for this prototype.

---

### Decisions still needed before pushing

1. **GitHub**: org / account, repo name, public or private.
2. **Cloudflare**: which account, and the Pages project name (becomes
   `<name>.pages.dev`).
3. **Deploy path**: git‑connected (recommended, matches RMA) or direct
   `wrangler pages deploy`.
4. **Custom domain**: now, later, or never.
