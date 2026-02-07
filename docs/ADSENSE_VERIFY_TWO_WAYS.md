# AdSense verification: two ways to get the meta tag on a root URL

AdSense only verifies the **root** of the domain you enter (e.g. `https://panagiotis-afk.github.io/` or `https://yourdomain.com/`). Your GeoQuest app is at `https://panagiotis-afk.github.io/GeoQuest/`, so the root has no meta tag and verification fails.

Here are two ways to fix it. Pick **one**.

---

# Scenario A: Add a custom domain

Use this if you want your app to live at a domain you own (e.g. `https://geoquest.com` or `https://www.geoquest.com`). The root of that domain will serve your app, so the meta tag will be there.

## A1. Get a domain (if you don’t have one)

1. Buy a domain from a registrar (e.g. Namecheap, Google Domains, Cloudflare, GoDaddy).
2. You’ll use the registrar’s DNS settings in the next step.

## A2. Point the domain at GitHub Pages

1. In your **GeoQuest** repo on GitHub: **Settings** → **Pages** (left sidebar).
2. Under **Custom domain**, enter your domain (e.g. `www.geoquest.com` or `geoquest.com`).
3. Click **Save**. GitHub may show a DNS checklist.
4. In your **registrar’s DNS** (where you bought the domain), add the records GitHub asks for. Typical setup:
   - **For `www` (e.g. www.geoquest.com):** Add a **CNAME** record:  
     Name: `www` (or `www.geoquest.com` depending on the UI)  
     Value: `panagiotis-afk.github.io`
   - **For apex/root (e.g. geoquest.com):** Add **A** records (GitHub gives you 4 IPs) or use the registrar’s “redirect apex to www” so that `geoquest.com` → `www.geoquest.com`.
5. Wait for DNS to propagate (minutes to 48 hours). In repo **Settings → Pages**, GitHub will show “DNS check successful” when it’s ready.
6. Optionally enable **Enforce HTTPS** in the same Pages settings.

## A3. Build the app so it works at the domain root

Your app is currently built with base path **`/GeoQuest/`** for `https://panagiotis-afk.github.io/GeoQuest/`. When you serve from a custom domain, the site root is **`/`**, so the build must use base **`/`** for assets and links to work.

1. In **`.github/workflows/deploy-pages.yml`**, in the **Build** step `env`, set:
   ```yaml
   VITE_BASE_PATH: /
   ```
   (instead of `/${{ github.event.repository.name }}/`).
2. Commit and push. The workflow will build with base `/` and deploy.
3. Your app will then be at **`https://yourdomain.com/`** (or `https://www.yourdomain.com/`).  
   The old URL `https://panagiotis-afk.github.io/GeoQuest/` will no longer work correctly unless you keep a separate build with base `/GeoQuest/` (advanced).

## A4. Add the meta tag (already there)

Your **GeoQuest** `index.html` already has:

```html
<meta name="google-adsense-account" content="ca-pub-3282032568820293">
```

So once the custom domain is live and the build uses base `/`, the root URL will serve this page and the tag will be there.

## A5. Verify in AdSense

1. Open **https://yourdomain.com/** (or **https://www.yourdomain.com/**) in the browser.
2. **View Page Source** → search for `google-adsense-account` → confirm the meta tag is present.
3. In AdSense, **Add site** and enter **`https://yourdomain.com`** (or `https://www.yourdomain.com` — use the one that’s your canonical URL). No path.
4. Choose **Meta tag** and paste the same tag if asked.
5. Click **I've placed the code** → **Request review**.

---

# Scenario B: New root site (no custom domain)

Use this if you want to keep the app at `https://panagiotis-afk.github.io/GeoQuest/` and only need AdSense to verify the domain. You add a **separate** site at the root (`https://panagiotis-afk.github.io/`) that only exists to show the meta tag.

## B1. Create the root-site repo

1. On GitHub, click **New repository**.
2. **Repository name:** exactly **`panagiotis-afk.github.io`** (use your GitHub username).
   - This is a **user/org** Pages site; GitHub will serve it at `https://panagiotis-afk.github.io/`.
3. Set visibility (e.g. Public). **Do not** add a README or .gitignore yet if you want an empty repo.
4. Create the repository.

## B2. Add a minimal page with the AdSense meta tag

You need one HTML page at the **root** of this repo so that `https://panagiotis-afk.github.io/` serves it.

**Option 2a – Publish from branch root (simplest)**

1. In the **`panagiotis-afk.github.io`** repo, create a file named **`index.html`** in the **root** of the default branch (e.g. `main`).
2. Paste this (update the meta tag if AdSense gave you a different one):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google-adsense-account" content="ca-pub-3282032568820293">
    <title>panagiotis-afk.github.io</title>
  </head>
  <body>
    <p>Welcome. <a href="https://panagiotis-afk.github.io/GeoQuest/">Go to GeoQuest</a>.</p>
  </body>
</html>
```

3. Commit and push (e.g. “Add index with AdSense verification”).

**Option 2b – Publish from `/docs`**

1. Create a folder **`docs`** in the repo.
2. Put **`index.html`** inside **`docs`** with the same content as above.
3. Commit and push.
4. In the repo: **Settings** → **Pages** → **Source**: “Deploy from a branch” → Branch: `main` (or your default) → Folder: **`/docs`** → Save.

## B3. Turn on GitHub Pages for this repo

1. In **`panagiotis-afk.github.io`**: **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**: choose **Deploy from a branch**.
3. **Branch:** `main` (or your default branch). **Folder:** **`/ (root)`** if you put `index.html` in the repo root, or **`/docs`** if you used the docs folder.
4. Click **Save**. Wait until it says “Your site is live at https://panagiotis-afk.github.io/”.

## B4. Confirm the meta tag on the live root URL

1. Open **https://panagiotis-afk.github.io/** in the browser (no path, no `/GeoQuest/`).
2. Right‑click → **View Page Source**.
3. Search for **`google-adsense-account`**. You should see the meta tag in `<head>`.

## B5. Verify in AdSense

1. In AdSense, **Add site** (or edit the existing one).
2. Enter **`https://panagiotis-afk.github.io`** only (no path). Use the suggestion AdSense shows if it matches.
3. Verification method: **Meta tag**.
4. Paste the same tag:  
   `<meta name="google-adsense-account" content="ca-pub-3282032568820293">`
5. Click **I've placed the code** → **Request review**.

After the domain is verified, AdSense can show ads on **any path** under that domain, including **`https://panagiotis-afk.github.io/GeoQuest/`**. Your GeoQuest repo and its `index.html` stay as they are; the root repo is only for verification.

---

# Quick comparison

| | Scenario A: Custom domain | Scenario B: Root site only |
|--|---------------------------|-----------------------------|
| **Cost** | Domain fee (yearly) | Free |
| **URL people use** | `https://yourdomain.com/` | `https://panagiotis-afk.github.io/GeoQuest/` |
| **Build change** | Use `VITE_BASE_PATH: /` for deploy | None |
| **Extra repo** | No | Yes: `panagiotis-afk.github.io` |
| **Root URL** | Your app (with meta tag) | Minimal page (with meta tag) |

Use **A** if you want a custom domain and are okay changing the deploy base path. Use **B** if you want to keep everything on GitHub and only fix AdSense verification.
