import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } from "./supabase-env.generated";

const url = VITE_SUPABASE_URL?.trim() || undefined;
const publishableKey = VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || undefined;

export const supabase: SupabaseClient | null =
  url && publishableKey ? createClient(url, publishableKey) : null;

/** For debugging: are env vars set? (values are never exposed) */
export const supabaseEnvStatus = {
  urlSet: !!url,
  keySet: !!publishableKey,
};

export type ScoreRow = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};
