
CREATE TABLE public.special_classes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT ''::text,
  image_url text,
  image_position text DEFAULT '50% 50%'::text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.special_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read special_classes" ON public.special_classes
  FOR SELECT USING (true);

CREATE POLICY "Admins manage special_classes" ON public.special_classes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
