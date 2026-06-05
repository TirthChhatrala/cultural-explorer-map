
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT,
  featured_image TEXT,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT,
  location TEXT,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  text_color TEXT,
  bg_color TEXT,
  author_name TEXT,
  author_email TEXT,
  is_admin_generated BOOLEAN NOT NULL DEFAULT false,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT false,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ DEFAULT now(),
  seo_title TEXT,
  seo_description TEXT,
  structured JSONB,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO anon, authenticated;
GRANT ALL ON public.stories TO service_role;

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stories" ON public.stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stories" ON public.stories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete stories" ON public.stories FOR DELETE USING (true);

CREATE INDEX idx_stories_status ON public.stories (status);
CREATE INDEX idx_stories_published_at ON public.stories (published_at DESC);
CREATE INDEX idx_stories_category ON public.stories (category);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_stories_updated_at
BEFORE UPDATE ON public.stories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
