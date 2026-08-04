-- Migration: Update RLS policies and column constraints for Community Page
-- Date: 2026-08-04
-- Checks table column schema (from_user vs user_id) and applies public read RLS policies.

-- 1. Standardise column name in public.supports (ensure from_user exists)
DO $$
BEGIN
  -- If 'user_id' column exists in supports and 'from_user' does NOT exist, rename 'user_id' to 'from_user'
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'supports' AND column_name = 'user_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'supports' AND column_name = 'from_user'
  ) THEN
    ALTER TABLE public.supports RENAME COLUMN user_id TO from_user;
  END IF;
END;
$$;

-- 2. Update RLS on public.goals so all students can view community goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view own or friends goals" ON public.goals;
DROP POLICY IF EXISTS "Public goals are viewable by everyone" ON public.goals;

CREATE POLICY "Public goals are viewable by everyone"
  ON public.goals FOR SELECT
  USING (true);

-- 3. Update RLS on public.daily_checkins so community goal check-ins are visible
DROP POLICY IF EXISTS "Users can view checkins for own goals" ON public.daily_checkins;
DROP POLICY IF EXISTS "Public checkins are viewable by everyone" ON public.daily_checkins;

CREATE POLICY "Public checkins are viewable by everyone"
  ON public.daily_checkins FOR SELECT
  USING (true);

-- 4. Update RLS policies on public.supports
DROP POLICY IF EXISTS "Users can view supports" ON public.supports;
DROP POLICY IF EXISTS "Users can send supports" ON public.supports;
DROP POLICY IF EXISTS "Users can update own supports" ON public.supports;

CREATE POLICY "Users can view supports" ON public.supports FOR SELECT USING (true);
CREATE POLICY "Users can send supports" ON public.supports FOR INSERT WITH CHECK (auth.uid() = from_user);
CREATE POLICY "Users can update own supports" ON public.supports FOR UPDATE
  USING (auth.uid() = from_user) WITH CHECK (auth.uid() = from_user);

-- 5. Ensure UNIQUE constraint on supports (goal_id, from_user) for 1 reaction per user per goal
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'supports_goal_id_from_user_key'
  ) THEN
    ALTER TABLE public.supports ADD CONSTRAINT supports_goal_id_from_user_key UNIQUE (goal_id, from_user);
  END IF;
EXCEPTION
  WHEN duplicate_object OR duplicate_table THEN NULL;
END $$;
