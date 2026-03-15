ALTER TABLE public.workshops ADD COLUMN short_description text DEFAULT '' NOT NULL;
ALTER TABLE public.workshops ADD COLUMN target_audience text DEFAULT '' NOT NULL;