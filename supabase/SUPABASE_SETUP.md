# Supabase setup for GeoQuest leaderboard

Use this checklist if the leaderboard shows an error or "Env: URL ✗ · Key ✗".

---

## 1. Create a Supabase project (if you haven’t)

1. Go to **[app.supabase.com](https://app.supabase.com)** and sign in.
2. **New project** → name (e.g. `GeoQuest`), set a **Database password**, choose a **region** → **Create**.
3. Wait until the project is ready.

---

## 2. Get Project URL and Publishable key

1. In the left sidebar, click **Settings** (gear).
2. Under **Project Settings**, click **API**.
3. Copy:
   - **Project URL** — e.g. `https://abcdefgh.supabase.co` (no trailing slash).
4. Open **API Keys** (same Settings area or **API Keys** in the sidebar).
5. Copy the **Publishable key** (starts with `sb_publishable_...`).  
   This key is safe to use in the browser when you have Row Level Security (RLS) enabled on your tables.  
   *(Legacy anon JWT is still supported: set `VITE_SUPABASE_ANON_KEY` instead if you prefer.)*

Put them in your app’s **`.env.local`** (project root):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...your_key...
```

No quotes, no spaces around `=`. Then **restart the dev server** (`npm run dev`).

---

## 3. Create the `scores` table and RLS

1. In Supabase, open **SQL Editor** (left sidebar).
2. Click **+ New query**.
3. Copy the contents of **`supabase/schema.sql`** in this repo and paste into the editor.
4. Click **Run** (or Ctrl+Enter).

You should see “Success. No rows returned.” That creates the `scores` table and policies so the app can read and insert scores.

---

## 4. Check that the table exists

1. In Supabase, open **Table Editor** (left sidebar).
2. You should see a **`scores`** table with columns: `id`, `player_name`, `score`, `created_at`.
3. If it’s missing, run the SQL from step 3 again and fix any errors shown.

---

## 5. Common errors and fixes

| What you see | What to do |
|--------------|------------|
| **Env: URL ✗ · Key ✗** (or one ✗) | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`, then **restart** `npm run dev`. You can also use `VITE_SUPABASE_ANON_KEY` (legacy anon JWT) for backward compatibility. |
| **Invalid API key** | Use the **Publishable key** (`sb_publishable_...`) from **Settings → API Keys**. Or use the legacy **anon** JWT from **Legacy API Keys** and set `VITE_SUPABASE_ANON_KEY`. |
| **relation "scores" does not exist** | Run **`supabase/schema.sql`** in the Supabase **SQL Editor** (step 3). |
| **new row violates row-level security** | Run **`supabase/schema.sql`** so the INSERT policy exists. In **Table Editor → scores**, check that RLS is enabled and policies exist under **Policies**. |
| **requested path is invalid** (in browser) | That’s normal when opening the Project URL in a browser; the app uses the same URL with paths like `/rest/v1/scores`. |
| **Project is paused** | Free-tier projects pause after inactivity. In the dashboard, click **Restore project**. |

---

## 6. Test from the app

1. Restart dev server: `npm run dev`.
2. Open the app, open the **☰** sidebar.
3. Under **Leaderboard (Supabase)** you should see either “Loading scores…” then “No scores yet.” or a list.
4. Click **Add test score**. Your row should appear; you can also confirm it in **Table Editor → scores**.

If you still see an error, the exact message in the leaderboard box (e.g. “relation \"scores\" does not exist”) tells you which step to fix (table vs RLS vs key).
