# Serenity HRIS — prototype

A single-file React prototype of an HR / attendance app. The whole application
is **`hris-app.jsx`** at the repo root; everything else is a small Vite harness
that mounts it (`index.html`, `vite.config.js`, `preview/main.jsx`).

- No backend. All state is in-memory and resets on reload.
- Bilingual (Bahasa Indonesia default / English), light / dark / system theme.
- Device / GPS / face / Hadir integrations are **simulated** and labelled as such.
- Clock follows the machine's local time (`new Date()`).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5177
```

## Build

```bash
npm run build    # static output in dist/
npm run preview  # serve the built dist/ locally
```

## Deploy

Static site on **Cloudflare** (git‑connected Worker with static assets, config
in `wrangler.jsonc`). See [`DEPLOY.md`](./DEPLOY.md).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build output directory | `dist` |
| Root directory | *(repo root)* |
| Node version | 20 (pinned by `.node-version`) |
| Environment variables | *(none)* |

Every `git push` to `main` triggers a rebuild + deploy.
