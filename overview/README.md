# ION Network — Reference Architecture

A single static page (`index.html`) presenting the ION Network architecture: governance, network profile, core services, and Beckn participants.

No build step — `index.html` is the whole site.

## Deploy to Vercel

### Option A — Drag & drop (fastest)

1. Open https://vercel.com/new
2. Drag this `ion-site` folder onto the page
3. Vercel auto-detects "Other" / static site → click **Deploy**

### Option B — CLI

```bash
npm i -g vercel
cd ion-site
vercel            # preview deploy
vercel --prod     # production deploy
```

### Option C — GitHub

1. Push this folder to a GitHub repo
2. https://vercel.com/new → Import repo → Deploy

No framework preset needed. Vercel will serve `index.html` at the root.

## Local preview

Any static server works:

```bash
npx serve .
# or
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Files

- `index.html` — the page (HTML + CSS + inline SVG, dark-mode aware)
- `vercel.json` — clean URLs + minimal security headers
