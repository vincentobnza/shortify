-- Create URL analytics table for detailed tracking
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

-- Add last_accessed column to urls table
ALTER TABLE public.urls ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.urls ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create function to record detailed analytics for each URL visit
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
