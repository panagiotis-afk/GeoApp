# AdSense verification when your app is on a path (e.g. /GeoQuest/)

**→ For both “custom domain” and “root site” steps in one place, see [ADSENSE_VERIFY_TWO_WAYS.md](./ADSENSE_VERIFY_TWO_WAYS.md).**

AdSense only accepts a **domain** (e.g. `panagiotis-afk.github.io`), not a path. It checks the **root** URL: `https://panagiotis-afk.github.io/`. Your app lives at `https://panagiotis-afk.github.io/GeoQuest/`, so the root has no meta tag and verification fails.

**Fix:** Put the verification meta tag on the root by creating a **user/org GitHub Pages site** (Scenario B in the doc above).

---

## Step 1: Create the root site repo

1. On GitHub, create a **new repository**.
2. **Name it exactly:** `panagiotis-afk.github.io` (replace with your GitHub username).
   - For user pages it must be `username.github.io`; then GitHub serves it at `https://username.github.io/`.
3. Leave it empty (no README needed) or add the file in the next step.

---

## Step 2: Add a minimal index.html with the AdSense tag

In that repo, create **`index.html`** in the **root** (or in the `docs` folder if you use **Settings → Pages → Deploy from branch → docs/**).

Use this content (replace the meta tag with the one AdSense gave you):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- AdSense verification - required for domain verification -->
    <meta name="google-adsense-account" content="ca-pub-3282032568820293">
    <title>panagiotis-afk.github.io</title>
  </head>
  <body>
    <p>Welcome. <a href="https://panagiotis-afk.github.io/GeoQuest/">Go to GeoQuest</a>.</p>
  </body>
</html>
```

Commit and push. Enable GitHub Pages for this repo (Settings → Pages → source: main branch, root or /docs).

---

## Step 3: Verify in AdSense

1. Wait a minute so `https://panagiotis-afk.github.io/` serves the new page.
2. Open **https://panagiotis-afk.github.io/** in the browser → **View Page Source** → confirm you see `google-adsense-account`.
3. In AdSense, add the site as **https://panagiotis-afk.github.io** (domain only).
4. Choose **Meta tag** verification and paste the same meta tag if asked.
5. Click **I've placed the code** → **Request review**.

Once the domain is verified, AdSense can show ads on **any path** under that domain (including `https://panagiotis-afk.github.io/GeoQuest/`). Your GeoQuest app keeps its meta tag in its own `index.html`; the root site is only for passing verification.
