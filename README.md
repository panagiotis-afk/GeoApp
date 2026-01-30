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

## Troubleshooting

If you see **"Cannot find module @rollup/rollup-win32-x64-msvc"** or **"not a valid Win32 application"** on Windows, do a clean reinstall:

```bash
Remove-Item -Recurse -Force node_modules; Remove-Item -Force package-lock.json; npm install
```

Then run `npm run dev` or `npm run build` again.

---

Built with **React**, **TypeScript**, and **Vite**.
