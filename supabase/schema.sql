-- Shortify Database Schema
-- This schema is for a URL shortener application that allows users to create short links,
-- track clicks, and view analytics for their shortened URLs.

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- URLs Table - Stores all shortened URLs
CREATE TABLE IF NOT EXISTS public.urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_url TEXT NOT NULL,
  short_id VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  clicks INT DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NULL,
  user_id UUID DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create an index on short_id for faster lookups
CREATE INDEX IF NOT EXISTS urls_short_id_idx ON urls (short_id);
-- Index for user's URLs
CREATE INDEX IF NOT EXISTS urls_user_id_idx ON urls (user_id);

-- URL Analytics Table - Store detailed click/access analytics
CREATE TABLE IF NOT EXISTS public.url_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url_id UUID NOT NULL REFERENCES public.urls(id) ON DELETE CASCADE,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  region TEXT,
  city TEXT
);

-- Create index for faster analytics queries
CREATE INDEX IF NOT EXISTS url_analytics_url_id_idx ON url_analytics (url_id);
CREATE INDEX IF NOT EXISTS url_analytics_accessed_at_idx ON url_analytics (accessed_at);

-- Custom Domains Table (for future premium feature)
CREATE TABLE IF NOT EXISTS public.custom_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  domain VARCHAR(255) NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table (for future authentication feature)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  monthly_quota INT DEFAULT 100,
  links_created INT DEFAULT 0
);

-- Tags Table (for organizing URLs)
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, user_id)
);

-- URL Tags Junction Table 
CREATE TABLE IF NOT EXISTS public.url_tags (
  url_id UUID REFERENCES public.urls(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (url_id, tag_id)
);

-- Functions --

-- Function to increment the click count
CREATE OR REPLACE FUNCTION increment_clicks(row_id TEXT)
RETURNS INT AS $$
DECLARE
  new_clicks INT;
BEGIN
  UPDATE urls 
  SET 
    clicks = clicks + 1, 
    last_accessed = NOW()
  WHERE short_id = row_id
  RETURNING clicks INTO new_clicks;
  
  RETURN new_clicks;
END;
$$ LANGUAGE plpgsql;

-- Function to record detailed analytics for each URL visit
CREATE OR REPLACE FUNCTION record_url_visit(
  url_short_id TEXT,
  user_agent TEXT DEFAULT NULL,
  referrer TEXT DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  region TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  url_record public.urls%ROWTYPE;
BEGIN
  -- First, get the URL record
  SELECT * INTO url_record FROM public.urls WHERE short_id = url_short_id;
  
  -- If the URL exists
  IF FOUND THEN
    -- Update click count and last accessed
    UPDATE public.urls
    SET 
      clicks = clicks + 1,
      last_accessed = NOW()
    WHERE id = url_record.id;
    
    -- Insert analytics record
    INSERT INTO public.url_analytics (
      url_id, 
      user_agent, 
      referrer, 
      ip_address, 
      country, 
      region, 
      city
    ) VALUES (
      url_record.id,
      user_agent,
      referrer,
      ip_address,
      country,
      region,
      city
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check user link quota before creating a new link
CREATE OR REPLACE FUNCTION check_user_quota()
RETURNS TRIGGER AS $$
BEGIN
  -- For authenticated users, check and update quota
  IF NEW.user_id IS NOT NULL THEN
    -- Check if the user has exceeded their quota
    DECLARE
      user_record public.users%ROWTYPE;
    BEGIN
      SELECT * INTO user_record FROM public.users WHERE id = NEW.user_id;
      
      IF FOUND AND user_record.links_created >= user_record.monthly_quota THEN
        RAISE EXCEPTION 'User has exceeded their monthly quota';
      END IF;
      
      -- Update the links created count
      UPDATE public.users
      SET links_created = links_created + 1
      WHERE id = NEW.user_id;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers --

-- Trigger to check quota before creating a new URL
CREATE TRIGGER check_user_quota_before_insert
BEFORE INSERT ON public.urls
FOR EACH ROW
EXECUTE PROCEDURE check_user_quota();

-- Row Level Security Policies (after enabling authentication) --

-- Enable RLS on tables
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
