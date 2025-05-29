-- Create URLs table
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_url TEXT NOT NULL,
  short_id VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  clicks INT DEFAULT 0
);

-- Create an index on short_id for faster lookups
CREATE INDEX IF NOT EXISTS urls_short_id_idx ON urls (short_id);

-- Create a function to increment the click count
CREATE OR REPLACE FUNCTION increment_clicks(row_id TEXT)
RETURNS INT AS $$
DECLARE
  new_clicks INT;
BEGIN
  UPDATE urls 
  SET clicks = clicks + 1
  WHERE short_id = row_id
  RETURNING clicks INTO new_clicks;
  
  RETURN new_clicks;
END;
$$ LANGUAGE plpgsql;
