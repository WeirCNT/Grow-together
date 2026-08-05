-- ========================================================
-- GROW TOGETHER: DAILY ENCOURAGEMENT SYSTEM SCHEMA & MIGRATION
-- ========================================================

-- 1. `supports` Table schema:
-- Contains: id, goal_id, from_user, message, created_at
-- Unique constraint: (goal_id, from_user)

CREATE TABLE IF NOT EXISTS public.supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  from_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL DEFAULT '❤️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT supports_goal_from_user_key UNIQUE (goal_id, from_user)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_supports_goal_id ON public.supports(goal_id);
CREATE INDEX IF NOT EXISTS idx_supports_from_user ON public.supports(from_user);
CREATE INDEX IF NOT EXISTS idx_supports_created_at ON public.supports(created_at);

-- 2. `notifications` Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  message TEXT NOT NULL DEFAULT '❤️',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Supports Policies
DROP POLICY IF EXISTS "Supports are viewable by everyone" ON public.supports;
CREATE POLICY "Supports are viewable by everyone" 
  ON public.supports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can encourage other users goals" ON public.supports;
CREATE POLICY "Users can encourage other users goals" 
  ON public.supports FOR INSERT WITH CHECK (
    auth.uid() = from_user AND
    NOT EXISTS (
      SELECT 1 FROM public.goals WHERE id = goal_id AND user_id = auth.uid()
    )
  );

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert notifications for goal owners" ON public.notifications;
CREATE POLICY "Users can insert notifications for goal owners" 
  ON public.notifications FOR INSERT WITH CHECK (auth.uid() = from_user);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
