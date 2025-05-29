-- Users Table (for authentication features)
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

-- Add user_id to urls table to track ownership
ALTER TABLE public.urls ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT NULL;
CREATE INDEX IF NOT EXISTS urls_user_id_idx ON urls (user_id);

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

-- Trigger to check quota before creating a new URL
CREATE TRIGGER check_user_quota_before_insert
BEFORE INSERT ON public.urls
FOR EACH ROW
EXECUTE PROCEDURE check_user_quota();
