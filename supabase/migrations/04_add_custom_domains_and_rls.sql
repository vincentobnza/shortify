-- Custom Domains Table (for premium feature)
CREATE TABLE IF NOT EXISTS public.custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on tables
ALTER TABLE public.urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_tags ENABLE ROW LEVEL SECURITY;

-- Policy for URLs - users can read/write only their URLs, but anyone can read URLs for redirection
CREATE POLICY urls_select_policy ON public.urls 
  FOR SELECT USING (true); -- Allow reading any URL for redirection

CREATE POLICY urls_insert_policy ON public.urls 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY urls_update_delete_policy ON public.urls 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Analytics - users can only see analytics for their URLs
CREATE POLICY url_analytics_policy ON public.url_analytics 
  USING (url_id IN (
    SELECT id FROM public.urls WHERE user_id = auth.uid()
  ));

-- Custom domains - users can only manage their domains
CREATE POLICY custom_domains_policy ON public.custom_domains 
  USING (user_id = auth.uid());

-- Tags - users can only manage their tags
CREATE POLICY tags_policy ON public.tags 
  USING (user_id = auth.uid());

-- URL Tags - users can only see/modify tags for their URLs
CREATE POLICY url_tags_policy ON public.url_tags 
  USING (url_id IN (
    SELECT id FROM public.urls WHERE user_id = auth.uid()
  ));
