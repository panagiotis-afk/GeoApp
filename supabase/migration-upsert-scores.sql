-- Run this in Supabase SQL Editor after schema.sql (one-time migration).
-- Enables one row per player and upsert (insert or update to keep highest score).

-- 1. If you already have duplicate player_name rows, keep one per player with max score (run once):
-- DELETE FROM public.scores a
-- USING public.scores b
-- WHERE a.player_name = b.player_name AND a.score < b.score;

-- Or keep highest score per player and remove others (alternative):
-- CREATE TABLE public.scores_dedup AS
--   SELECT DISTINCT ON (player_name) * FROM public.scores ORDER BY player_name, score DESC;
-- TRUNCATE public.scores;
-- INSERT INTO public.scores SELECT * FROM public.scores_dedup;
-- DROP TABLE public.scores_dedup;

-- 2. Add unique constraint so we can upsert by player_name
ALTER TABLE public.scores
  ADD CONSTRAINT scores_player_name_key UNIQUE (player_name);

-- 3. Allow update (for upsert)
CREATE POLICY "Anyone can update scores"
  ON public.scores FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 4. RPC: insert or update, keeping the higher score
CREATE OR REPLACE FUNCTION public.submit_score(p_player_name text, p_score int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.scores (player_name, score)
  VALUES (p_player_name, p_score)
  ON CONFLICT (player_name)
  DO UPDATE SET score = greatest(public.scores.score, excluded.score);
END;
$$;

-- 5. Let anon call the function
GRANT EXECUTE ON FUNCTION public.submit_score(text, int) TO anon;
GRANT EXECUTE ON FUNCTION public.submit_score(text, int) TO authenticated;
