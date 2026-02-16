
ALTER TABLE public.classes ADD COLUMN is_recurring boolean NOT NULL DEFAULT true;
ALTER TABLE public.classes ADD COLUMN specific_date text;
