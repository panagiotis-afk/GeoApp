# GeoQuest — Geography Game

A geography web game inspired by **GeoGuessr** and **Travle**.

## Run locally

1. **Install and start the dev server:**
   ```bash
   npm install
   npm run dev
   ```
2. **Keep that terminal window open** — closing it stops the server.
3. Open **http://localhost:5173** in your browser (Vite may open it automatically).

**If you get "This site can't be reached" or a Rollup error:**  
Do a clean reinstall so Windows gets the correct native binaries:
   ```bash
   # In the project folder (PowerShell or Command Prompt):
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   npm run dev
   ```
   Then open http://localhost:5173 (or the URL shown in the terminal).

## Game modes

- **Pin the Country** — We show a country name; you click on the world map. Score is based on how close your guess is (GeoGuessr-style).
- **Country Trail** — Connect two countries by naming bordering countries in a chain (Travle-style).
- **Flag Quiz** — Guess the country from its flag (multiple choice).

## Build

```bash
npm run build
npm run preview   # serve the built app
```

## Host on GitHub Pages

You can host GeoQuest for free so anyone can play it.

1. **Create a GitHub repo** and push this project (e.g. repo name: `GeoQuest` or `geo-quest`).

2. **Turn on GitHub Pages with Actions:**
   - In the repo: **Settings** → **Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

3. **Deploy:**
   - Push to the `main` (or `master`) branch, or run the workflow from **Actions** → **Deploy to GitHub Pages** → **Run workflow**.
   - After it finishes, the site will be at:  
     **`https://<your-username>.github.io/<repo-name>/`**  
     (e.g. `https://jane.github.io/GeoQuest/`)

The workflow builds the app and deploys the `dist` folder. The first run may need you to approve the **github-pages** environment in **Settings** → **Environments** (one-time).

**Getting 404?** Check:
1. **Use the full URL** including your repo name: `https://<your-username>.github.io/<repo-name>/` (e.g. `https://panagiotis-afk.github.io/GeoApp/`). The trailing slash matters.
2. **Pages source** must be **GitHub Actions**, not "Deploy from a branch". In the repo: **Settings** → **Pages** → **Build and deployment** → **Source** → **GitHub Actions**.
3. In **Actions**, confirm the "Deploy to GitHub Pages" workflow ran and the **deploy** step succeeded. Then open the URL from step 1.

## Bug reports

Users can report bugs from the sidebar (**Report a bug**). To **create the issue from the app** (no opening GitHub):

1. **Create a GitHub Personal Access Token**  
   GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic).  
   Give it the **repo** scope. Copy the token (starts with `ghp_`).

2. **Local dev**  
   In `.env` add:
   ```bash
   VITE_BUG_REPORT_API_URL=http://localhost:5173/api/create-issue
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_REPO=your-username/GeoApp
   ```
   In one terminal run `npm run api`, in another run `npm run dev`. Submitting the bug form will create the issue on GitHub.

3. **Production (e.g. GitHub Pages)**  
   Deploy the API (e.g. [Vercel](https://vercel.com)): push the repo and add the `api` folder. In Vercel set env vars `GITHUB_TOKEN` and `GITHUB_REPO`.  
   In your project `.env` set `VITE_BUG_REPORT_API_URL=https://your-app.vercel.app/api/create-issue`, then build and deploy the frontend. Visitors’ bug reports will create issues via the API.

**Fallback (no API):** If `VITE_BUG_REPORT_API_URL` is not set but `VITE_GITHUB_REPO` is, Submit opens GitHub’s new-issue page with the form pre-filled; the user submits there.

## Buy me a coffee

A **"Buy me a coffee"** link appears in the sidebar when configured. Visitors can support you via [Buy Me a Coffee](https://buymeacoffee.com).

### What you need to do

1. **Create a Buy Me a Coffee account**
   - Go to [buymeacoffee.com](https://buymeacoffee.com) and sign up (free).
   - Choose your username (e.g. `panagiotis`). Your page will be `https://buymeacoffee.com/panagiotis`.

2. **Configure the app**
   - **Local dev:** In `.env` (or `.env.local`) add:
     ```bash
     VITE_BUY_ME_A_COFFEE=panagiotis
     ```
     (Use your username, or a full URL like `https://buymeacoffee.com/panagiotis`.)
   - **Production (GitHub Pages):** In your repo go to **Settings → Secrets and variables → Actions**. Add a **repository secret** named **`BUY_ME_A_COFFEE`** with value your username (e.g. `panagiotis`) or the full URL. The deploy workflow passes it into the build, so the link will show on the live site after the next deploy.

3. **Redeploy** (if using GitHub Pages) so the build picks up the secret. The "☕ Buy me a coffee" button will then appear in the sidebar.

If `VITE_BUY_ME_A_COFFEE` (or the `BUY_ME_A_COFFEE` secret) is not set, the button is hidden.

## Troubleshooting

If you see **"Cannot find module @rollup/rollup-win32-x64-msvc"** or **"not a valid Win32 application"** on Windows, do a clean reinstall:

```bash
Remove-Item -Recurse -Force node_modules; Remove-Item -Force package-lock.json; npm install
```

Then run `npm run dev` or `npm run build` again.

---

Built with **React**, **TypeScript**, and **Vite**.
