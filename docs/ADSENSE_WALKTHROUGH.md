# Google AdSense walkthrough for GeoQuest

The app is **wired for AdSense**: when you set the env vars and add the verification meta tag, the footer and sidebar slots will load real ads (no code changes needed). Follow these steps in order. You’ll use the **AdSense website** and your **GeoQuest repo**.

---

## Step 1: Apply for AdSense (if you don’t have an account)

1. Go to **[google.com/adsense](https://www.google.com/adsense)** and sign in with your Google account.

2. Click **Get started** and follow the steps:
   - Enter your **site URL** (e.g. `https://yourusername.github.io/GeoApp/` for GitHub Pages, or your custom domain).
   - AdSense will ask for your **country**, **time zone**, and **payments** info.

3. Add the **AdSense verification code** to your site:
   - AdSense gives you a meta tag or a small script to add.
   - For a React/Vite app, add the **meta tag** in `index.html` inside `<head>`:
     ```html
     <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
     ```
     (They’ll show you the exact line; the content is your publisher ID.)

4. In AdSense, click **I’ve added the code. Check for it**. Google will verify your site (can take from minutes to a few days).

5. Wait for **approval**. You’ll get an email when your account is ready. New sites sometimes take a few days or longer.

---

## Step 2: Get your publisher ID (client ID)

1. In **[AdSense](https://www.google.com/adsense)** go to **Account** → **Settings** (or **Settings** in the left menu).

2. Find **Account information** (or **Product settings**). Your **Publisher ID** is shown as:
   ```text
   ca-pub-XXXXXXXXXXXXXXXX
   ```
   Copy it; you’ll use it as your “client ID” in the app.

---

## Step 3: Create two ad units (for footer and sidebar)

1. In AdSense go to **Ads** → **By ad unit** (or **Ad units**).

2. Click **Create ad unit** (or **Display ads** → **Create new ad unit**).

3. **First ad unit – footer banner**
   - **Ad type**: e.g. **Display ads**.
   - **Ad unit name**: e.g. `GeoQuest – Footer`.
   - **Ad size**: choose **Responsive** (or “Responsive” / “Auto”) so it fits the footer width.
   - Create the unit. On the next screen you’ll see the **Ad unit ID** (a number like `1234567890`). Copy it; this is **Slot 1** (footer).

4. **Second ad unit – sidebar**
   - Click **Create ad unit** again.
   - **Ad unit name**: e.g. `GeoQuest – Sidebar`.
   - **Ad size**: choose **Responsive** or **Medium rectangle (300×250)**.
   - Create the unit and copy the **Ad unit ID**; this is **Slot 2** (sidebar).

Keep both IDs handy (e.g. in a note). They’re the numeric “slot” IDs you’ll put in `.env.local`.

---

## Step 4: Add your IDs to the app

1. In your GeoQuest repo open **`.env.local`** (in the project root, same folder as `package.json`).

2. Add these lines (use your real values):

   ```env
   # Google AdSense (optional – leave empty to show placeholder)
   VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   VITE_ADSENSE_SLOT_FOOTER=1234567890
   VITE_ADSENSE_SLOT_SIDEBAR=0987654321
   ```

   - Replace `ca-pub-XXXXXXXXXXXXXXXX` with your **Publisher ID** from Step 2.
   - Replace `1234567890` with the **footer** ad unit ID from Step 3.
   - Replace `0987654321` with the **sidebar** ad unit ID from Step 3.

3. Save the file. Restart the dev server (`npm run dev`) so the new env vars are picked up.

---

## Step 5: Add the verification meta tag (for approval)

1. Open **`index.html`** in the project root.

2. Inside `<head>`, add the line AdSense gave you when you applied, for example:

   ```html
   <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
   ```

   Replace the `content` value with your real publisher ID. This is the same as `VITE_ADSENSE_CLIENT` but without the `ca-pub-` prefix in the meta tag? No – AdSense usually wants the full `ca-pub-XXXXXXXXXXXXXXXX` in the meta tag. So use the same value as in `.env.local`.

3. Save. Deploy your site (e.g. push to GitHub so GitHub Pages serves the updated `index.html`). AdSense checks the live URL.

---

## Step 6: Run the app and check the ads

1. Run the app locally:
   ```bash
   npm run dev
   ```

2. Open the app in the browser. You should see:
   - A **footer ad** above “Inspired by GeoGuessr & Travle”.
   - A **sidebar ad** at the bottom of the ☰ sidebar.

3. If you see “Ad” placeholders instead of real ads:
   - Check that `.env.local` has the correct `VITE_ADSENSE_CLIENT` and both slot IDs.
   - Restart the dev server after changing `.env.local`.
   - New accounts or new units can take a few hours to start serving; test ads may appear first.

4. For **GitHub Pages**: add the same env vars as **repository secrets** (e.g. `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT_FOOTER`, `VITE_ADSENSE_SLOT_SIDEBAR`) and pass them into the build in your GitHub Actions workflow so the built app has the IDs.

---

## Quick checklist

| Step | Where | What |
|------|--------|------|
| 1 | google.com/adsense | Apply, add verification code, get approved |
| 2 | AdSense → Account / Settings | Copy Publisher ID (`ca-pub-XXX`) |
| 3 | AdSense → Ads → Create ad unit | Create 2 units, copy both Ad unit IDs |
| 4 | `.env.local` | Set `VITE_ADSENSE_CLIENT`, `VITE_ADSENSE_SLOT_FOOTER`, `VITE_ADSENSE_SLOT_SIDEBAR` |
| 5 | `index.html` | Add `<meta name="google-adsense-account" content="ca-pub-XXX" />` |
| 6 | App + deploy | Restart dev server, deploy, wait for ads to serve |

---

## Troubleshooting

- **“Ad” placeholder only**  
  Env vars not set or wrong. Check `.env.local`, restart dev server, and for production ensure the build receives the same vars.

- **Blank ad space**  
  Normal for new units. Wait a few hours or use AdSense’s “Preview” / test mode if available.

- **Policy or approval issues**  
  Follow [AdSense program policies](https://support.google.com/adsense/answer/48182). Avoid too many ads, misleading content, or prohibited content.

- **GitHub Pages build**  
  In your workflow (e.g. `.github/workflows/deploy-pages.yml`), add the three AdSense env vars to the `env` of the Build step (from repository secrets), same as you did for Supabase.
