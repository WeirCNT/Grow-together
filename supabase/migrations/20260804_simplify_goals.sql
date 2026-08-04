-- Apply this once in the Supabase SQL Editor for an existing deployment.
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.goals DROP COLUMN IF EXISTS category;
