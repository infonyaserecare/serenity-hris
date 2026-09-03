# Serenity HRIS — prototype

A single-file React prototype of an HR / attendance app. The whole application
is **`hris-app.jsx`** at the repo root; everything else is a small Vite harness
that mounts it (`index.html`, `vite.config.js`, `preview/main.jsx`).

- No backend. All state is in-memory and resets on reload.
- Bilingual (Bahasa Indonesia default / English), light / dark / system theme.
- Device / GPS / face / Hadir integrations are **simulated** and labelled as such.
- Clock follows the machine's local time (`new Date()`).

## Data

Ships **blank** (`const DEMO_DATA = false` near the top of `hris-app.jsx`):
no employees, no attendance, no devices. You add the real organisation from
inside the app.

- **First sign-in:** username `admin`, any password. That is the one bootstrap
  HR account. Everyone you add afterwards sets their own password via the
  invite → activation flow.
- **Lifecycle:** Employees → *Add employee* creates a person + a Pending
  account → Administration → *Send invitation* (opens a pre‑filled email with a
  one‑time code, or *Copy invitation*) → the new person uses *First time signing
  in?* with their email + code → *Suspend* on the Active tab revokes access when
  someone leaves.
- Set `DEMO_DATA = true` to load a fictional 20‑person company with a month of
  synthetic attendance (for demos / screenshots).

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
