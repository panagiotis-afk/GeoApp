-- Run this in Supabase Dashboard → SQL Editor → New query
-- Creates scores table and RLS for leaderboards

-- 1. Create scores table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- 3. Allow anyone to read scores (for leaderboard display)
CREATE POLICY "Anyone can read scores"
  ON public.scores FOR SELECT
  USING (true);

-- 4. Allow anyone to insert a score (for submitting new scores)
CREATE POLICY "Anyone can insert scores"
  ON public.scores FOR INSERT
  WITH CHECK (true);

-- Optional: allow anyone to delete their own row (by id) – uncomment if needed
-- CREATE POLICY "Anyone can delete scores"
--   ON public.scores FOR DELETE
--   USING (true);

-- 5. Index for fast leaderboard queries (top scores, recent)
CREATE INDEX IF NOT EXISTS idx_scores_score_desc ON public.scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_created_at ON public.scores (created_at DESC);
