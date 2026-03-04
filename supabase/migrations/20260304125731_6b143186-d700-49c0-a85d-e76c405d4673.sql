
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS image_position text DEFAULT '50% 50%';
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS image_position text DEFAULT '50% 50%';
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS image_position text DEFAULT '50% 50%';
