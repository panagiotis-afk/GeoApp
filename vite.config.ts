import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Parse KEY=VALUE or KEY="VALUE" from .env-style lines; strip quotes, trim, and strip \\r (Windows). */
function parseEnvFile(dir: string, filename: string): Record<string, string> {
  const out: Record<string, string> = {}
  const filePath = path.join(dir, filename)
  if (!fs.existsSync(filePath)) return out
  let content = fs.readFileSync(filePath, 'utf-8')
  content = content.replace(/^\uFEFF/, '') // strip BOM (Windows)
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/\r/g, '').trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim().replace(/\r/g, '')
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
      value = value.slice(1, -1).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue
    out[key] = value
  }
  return out
}

// For GitHub Pages: base must be /repo-name/ (set in deploy workflow). Local dev: base is /
export default defineConfig(({ mode }) => {
  const envDir = __dirname
  const cwd = process.cwd()
  const fromLoadEnv = loadEnv(mode, envDir, 'VITE_')
  const fromEnv = { ...parseEnvFile(envDir, '.env'), ...parseEnvFile(cwd, '.env') }
  const fromEnvLocal = { ...parseEnvFile(envDir, '.env.local'), ...parseEnvFile(cwd, '.env.local') }
  const url = (fromEnvLocal.VITE_SUPABASE_URL ?? fromEnv.VITE_SUPABASE_URL ?? fromLoadEnv.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').trim()
  // Prefer Publishable key (sb_publishable_...); fall back to legacy anon (eyJ...) for backward compat
  let key = (fromEnvLocal.VITE_SUPABASE_PUBLISHABLE_KEY ?? fromEnv.VITE_SUPABASE_PUBLISHABLE_KEY ?? fromLoadEnv.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? fromEnvLocal.VITE_SUPABASE_ANON_KEY ?? fromEnv.VITE_SUPABASE_ANON_KEY ?? fromLoadEnv.VITE_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '').trim()
  // Fallback: if URL is set but key empty, look for any env line whose value looks like a Publishable key (typo in var name)
  if (url && !key) {
    const allLocal = { ...fromEnvLocal, ...fromEnv }
    const publishableEntry = Object.entries(allLocal).find(([, v]) => typeof v === 'string' && v.trim().startsWith('sb_publishable_'))
    if (publishableEntry) key = publishableEntry[1].trim().replace(/\r/g, '')
  }

  // Write env into a generated file so the client always gets values (avoids define/import.meta.env issues)
  const generatedPath = path.join(envDir, 'src', 'lib', 'supabase-env.generated.ts')
  fs.writeFileSync(generatedPath, `// Auto-generated from .env.local - do not edit
export const VITE_SUPABASE_URL = ${JSON.stringify(url)};
export const VITE_SUPABASE_PUBLISHABLE_KEY = ${JSON.stringify(key)};
`)

  return {
  base: process.env.VITE_BASE_PATH ?? fromLoadEnv.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  envDir,
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(url),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(key),
  },
  server: {
    host: true,        // listen on 0.0.0.0 so localhost and 127.0.0.1 both work
    port: 5173,
    open: true,        // open browser automatically when you run npm run dev
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
  }
})
