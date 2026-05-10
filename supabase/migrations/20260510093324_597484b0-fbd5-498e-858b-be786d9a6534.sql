ALTER TABLE public.workshops 
  ADD COLUMN IF NOT EXISTS instructor text DEFAULT '',
  ADD COLUMN IF NOT EXISTS display_from date;