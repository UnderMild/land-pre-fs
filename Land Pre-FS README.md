# Land Pre‑FS — Deploy Bundle

This bundle includes:
- `index.html` (the V6 app)
- This `README.md`

## Option A — GitHub Pages (classic, free)
1) Create a **public** repository on GitHub (e.g., `land-pre-fs`).
2) Upload both files: `index.html` and `README.md` to the repo's **main** branch.
3) Go to **Settings → Pages**:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main`
   - **Folder**: `/root`
4) Wait ~1 minute. Your site will be available at:
   `https://<username>.github.io/<repo-name>`
5) (Optional) Custom domain: set it in **Pages** and create a CNAME record at your DNS.

## Option B — Vercel (developer‑friendly)
**Web dashboard:**
1) Create a new Vercel project → **Import GitHub repo** that contains `index.html` at root.
2) Vercel detects a static site automatically → **Deploy**.
3) You get an URL like `https://land-pre-fs-<hash>.vercel.app`.
4) (Optional) Add a custom domain (e.g., `pre-fs.yourbrand.com`).

**Vercel CLI (optional):**
```bash
npm i -g vercel
vercel  # follow prompts; pick this folder; accept defaults
```

## Option C — Netlify (developer‑friendly)
**Web dashboard:**
1) Create a new site from Git → select your GitHub repo.
2) Build command: *(leave blank)*, Publish directory: `/` (root).
3) **Deploy** → you'll get something like `https://land-pre-fs.netlify.app`.
4) (Optional) Set custom domain and password protection in **Site settings**.

**Netlify Drop (no Git):**
1) Go to Netlify Drop (drag‑and‑drop).
2) Drop `index.html` → you'll get a temporary public URL quickly.

## Tips
- If your repo already has other files, keep this app in a new branch (e.g., `gh-pages`) and set Pages to deploy from that branch.
- To version your app, commit with tags (e.g., `v6`) and create releases.
- For a private preview, Vercel/Netlify give you instant preview URLs per commit/branch.

---
Pack time: 2025-09-02T07:37:57.327663Z
