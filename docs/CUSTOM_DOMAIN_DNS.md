# Fix "DNS check unsuccessful" for geoquest.studio

GitHub shows **"DNS check unsuccessful"** and **"Both geoquest.studio and its alternate name are improperly configured"** because the domain isn’t pointing to GitHub yet. You need to add DNS records **where you bought the domain** (Namecheap, Cloudflare, Google Domains, Porkbun, GoDaddy, etc.).

---

## What GitHub needs

GitHub checks **two** names:

1. **geoquest.studio** (apex/root)
2. **www.geoquest.studio** (www subdomain)

So you must add records for **both**.

---

## Step 1: Log in at your domain registrar

Go to the site where you bought **geoquest.studio** and open **DNS settings** (often called "DNS", "Manage DNS", "DNS records", or "Nameservers / DNS").

---

## Step 2: Add records for the apex (geoquest.studio)

Choose **one** of these:

### Option A: A records (works everywhere)

Add **four A records** for the **apex** (root) of the domain:

| Type | Name / Host | Value / Points to | TTL (optional) |
|------|-------------|-------------------|----------------|
| A    | `@`         | `185.199.108.153` | 3600 or default |
| A    | `@`         | `185.199.109.153` | 3600 or default |
| A    | `@`         | `185.199.110.153` | 3600 or default |
| A    | `@`         | `185.199.111.153` | 3600 or default |

- **Name/Host:** `@` or blank or `geoquest.studio` (depends on the registrar; `@` usually means “root”).
- **Value:** exactly the IPs above (one record per IP).

If the UI has a single “A” record and allows multiple values, add all four IPs to that one record if possible; otherwise create four separate A records with the same name.

### Option B: ALIAS / ANAME (if your registrar supports it)

Some registrars (e.g. Cloudflare, DNSimple) support **ALIAS** or **ANAME**:

- **Type:** ALIAS or ANAME  
- **Name:** `@` (apex)  
- **Value / Target:** `panagiotis-afk.github.io`

Use this **instead of** the four A records above, not in addition.

---

## Step 3: Add record for www (www.geoquest.studio)

Add **one CNAME record**:

| Type  | Name / Host | Value / Points to           | TTL (optional) |
|-------|-------------|-----------------------------|----------------|
| CNAME | `www`       | `panagiotis-afk.github.io`  | 3600 or default |

- **Name:** `www` (or `www.geoquest.studio` if the registrar wants the full name).
- **Value:** `panagiotis-afk.github.io` — **no** `https://`, **no** path, **no** repo name (e.g. no `/GeoApp`).

---

## Step 4: Remove conflicting records

- If there is an **A** or **CNAME** for `@` that points somewhere else (e.g. parking page), remove or replace it with the GitHub A records (or ALIAS) above.
- Do **not** use wildcards like `*.geoquest.studio`.

---

## Step 5: Save and wait

1. Save the DNS changes at the registrar.
2. **Propagation:** DNS can take **a few minutes up to 24–48 hours**. GitHub will keep re-checking.
3. In the repo: **Settings → Pages**. Under "Custom domain", leave **geoquest.studio** and click **Save** again if you want to trigger another check.
4. When the check passes, the warning will disappear and **Enforce HTTPS** will become available (may take a bit longer after DNS is OK).

---

## Quick reference

| Purpose              | Type   | Name | Value                    |
|----------------------|--------|------|---------------------------|
| apex (geoquest.studio) | A      | `@`  | 185.199.108.153           |
| apex                 | A      | `@`  | 185.199.109.153           |
| apex                 | A      | `@`  | 185.199.110.153           |
| apex                 | A      | `@`  | 185.199.111.153           |
| www                  | CNAME  | `www`| panagiotis-afk.github.io  |

(Or use one ALIAS/ANAME for `@` → `panagiotis-afk.github.io` instead of the four A records.)

---

---

## "I cannot edit the records" (Squarespace or any locked preset)

If the **Squarespace Defaults** (or similar preset) can’t be edited:

### Option 1: Remove the preset, then add custom records

1. On the same **DNS Settings** page, look at the **"Squarespace Defaults"** (or "Add Preset") block.
2. Check for:
   - A **trash / delete** icon on the **whole preset block** (not on each row), or  
   - A **"Remove preset"** / **"Delete"** / **"Use custom DNS"** link or button.
3. If you find it, **remove or disable the Squarespace Defaults** preset.
4. Under **Custom records**, click **Add record** and add:
   - **Four A records:** Host `@`, Type `A`, Data: `185.199.108.153` then `185.199.109.153` then `185.199.110.153` then `185.199.111.153` (one record per IP).
   - **One CNAME:** Host `www`, Type `CNAME`, Data: `panagiotis-afk.github.io`.
5. Save. Wait 5–60 minutes and check GitHub again.

If there is **no** way to remove the preset (no trash, no "custom only" option), use **Option 2**.

### Option 2: Use Cloudflare for DNS (recommended if preset can’t be removed)

Point the domain’s **nameservers** to **Cloudflare** and manage DNS there. You keep the domain registered at Squarespace; only DNS is handled by Cloudflare.

1. **Sign up at [cloudflare.com](https://www.cloudflare.com)** (free plan is enough).
2. **Add the site:** Click **Add a site** → enter **geoquest.studio** → choose **Free** plan → Continue.
3. **Cloudflare will show current DNS records** (the Squarespace ones). Click **Continue**.
4. **Cloudflare will show two nameservers**, e.g.:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`  
   (yours will be different; copy the two they give you.)
5. **In Squarespace:** Go to **Domains** → **geoquest.studio** → **Domain Nameservers** (or **DNS** → **Nameservers**).  
   Change from "Squarespace nameservers" to **Custom** / **Use custom nameservers** and enter the **two Cloudflare nameservers**. Save.
6. **In Cloudflare:** After saving nameservers at Squarespace, go back to Cloudflare and click **Done, check nameservers**. Wait for "Active" (often 5–60 minutes, sometimes up to 24 hours).
7. **In Cloudflare DNS:** Go to **DNS** → **Records**. Remove any Squarespace/website A or CNAME records for **@** and **www** if you don’t need them. Then **Add record**:
   - **A** – Name `@`, IPv4 address `185.199.108.153`, Proxy status Off (grey cloud) → Save.  
   - Repeat for `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (four A records for `@`).
   - **CNAME** – Name `www`, Target `panagiotis-afk.github.io`, Proxy status Off (grey cloud) → Save.
8. Wait 5–60 minutes. In GitHub: **Settings → Pages**; the DNS check should pass.

Your domain stays registered at Squarespace; only DNS is at Cloudflare. You can add the same email-related records (e.g. MX, TXT) in Cloudflare later if you use email on the domain.

---

## Squarespace Domains (step-by-step)

If your DNS is at **Squarespace Domains**:

1. **A records for @ (apex)**  
   You currently have four **A** records for **@** pointing to Squarespace IPs. They must point to GitHub instead:
   - Edit each of the four **A** records for **@** (or delete them and add new ones).
   - Replace the **Data** values with GitHub’s IPs (one per record):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Keep **Host:** `@`, **Type:** A, **TTL:** 4 hrs (or default). Save.

2. **CNAME for www**  
   You have **www** → `ext-sq.squarespace.com`. Change it to point to GitHub:
   - Edit the **www** CNAME record.
   - Set **Data** to: `panagiotis-afk.github.io` (nothing else, no `https://`).
   - Keep **Host:** `www`, **Type:** CNAME. Save.

3. **@ HTTPS record**  
   Remove the **HTTPS** record for **@** if Squarespace lets you (it’s for Squarespace hosting and can conflict with GitHub). If you can’t remove it, try saving the A and CNAME changes first; sometimes the check still passes.

4. **Other records**  
   Leave **Email Security** and **_domainconnect** as they are (they don’t affect GitHub Pages).

5. **Save** and wait 5–60 minutes, then in GitHub go to **Settings → Pages** and check again. If it still says “DNS check unsuccessful”, wait up to 24 hours and recheck.

If Squarespace doesn’t allow editing the “Squarespace Defaults” preset, use **Custom records**: add four **A** records (Host `@`, Data = each GitHub IP above) and one **CNAME** (Host `www`, Data `panagiotis-afk.github.io`). Then remove or disable the Squarespace Defaults preset if there’s an option for it.

---

## If it still fails

- **Double-check** the CNAME value: `panagiotis-afk.github.io` only (your GitHub username + `.github.io`).
- **Wait** at least 1–2 hours and try again; some regions propagate slowly.
- Use the registrar’s “DNS propagation” or “check DNS” tool to confirm the new records show globally.
- See [GitHub’s troubleshooting](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages).
