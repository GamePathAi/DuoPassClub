-- AI Analytics Schema for Personal Finance and Social Behavioral Analytics
-- Execute this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_spending_analytics (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL,
  total_spent DECIMAL NOT NULL,
  category_breakdown JSONB,
  frequency_patterns JSONB,
  PRIMARY KEY (user_id, month_year)
);

CREATE TABLE IF NOT EXISTS public.social_connections (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  friend_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  connection_strength INTEGER,
  shared_experiences INTEGER,
  PRIMARY KEY (user_id, friend_user_id)
);

CREATE TABLE IF NOT EXISTS public.experience_optimization_data (
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  optimal_booking_time INTEGER,
  crowd_levels JSONB,
  satisfaction_by_timing JSONB,
  PRIMARY KEY (offer_id)
);

-- Enable RLS for security
ALTER TABLE public.user_spending_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_optimization_data ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed)
CREATE POLICY "Users can view own spending" ON public.user_spending_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own connections" ON public.social_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read for optimization data" ON public.experience_optimization_data FOR SELECT USING (true);