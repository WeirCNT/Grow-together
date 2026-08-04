-- Supabase Schema for Grow Together MVP

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create profiles inside the database transaction that creates an Auth user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, student_id, full_name, avatar)
  VALUES (
    NEW.id,
    UPPER(NEW.raw_user_meta_data ->> 'student_id'),
    NEW.raw_user_meta_data ->> 'full_name',
    NULL
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Daily Check-ins Table
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(goal_id, date)
);

-- 4. Supports Table
CREATE TABLE IF NOT EXISTS public.supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  from_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(goal_id, from_user)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Viewable by all authenticated users
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Goals: Public goals viewable by everyone, write operations restricted to owner
DROP POLICY IF EXISTS "Users can view own or friends goals" ON public.goals;
DROP POLICY IF EXISTS "Public goals are viewable by everyone" ON public.goals;
CREATE POLICY "Public goals are viewable by everyone" ON public.goals FOR SELECT USING (true);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Daily Check-ins: Viewable by everyone, write operations restricted to goal owner
DROP POLICY IF EXISTS "Users can view checkins for own goals" ON public.daily_checkins;
DROP POLICY IF EXISTS "Public checkins are viewable by everyone" ON public.daily_checkins;
CREATE POLICY "Public checkins are viewable by everyone" ON public.daily_checkins FOR SELECT USING (true);
CREATE POLICY "Users can insert checkins for own goals" ON public.daily_checkins FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.goals WHERE id = daily_checkins.goal_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete checkins for own goals" ON public.daily_checkins FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.goals WHERE id = daily_checkins.goal_id AND user_id = auth.uid())
);

-- Supports: Viewable by everyone, insert/update restricted to author
CREATE POLICY "Users can view supports" ON public.supports FOR SELECT USING (true);
CREATE POLICY "Users can send supports" ON public.supports FOR INSERT WITH CHECK (auth.uid() = from_user);
CREATE POLICY "Users can update own supports" ON public.supports FOR UPDATE
  USING (auth.uid() = from_user) WITH CHECK (auth.uid() = from_user);
