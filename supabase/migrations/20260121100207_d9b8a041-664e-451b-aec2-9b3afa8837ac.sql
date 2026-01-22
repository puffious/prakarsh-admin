-- Create events table
CREATE TABLE public.events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  organizer VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  category VARCHAR(100),
  misc TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access for everyone
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (true);