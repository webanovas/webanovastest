
-- Create storage bucket for site images (teachers, workshops)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Allow anyone to view images
CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

-- Allow admins to upload images
CREATE POLICY "Admins upload site-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update images
CREATE POLICY "Admins update site-images" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete images
CREATE POLICY "Admins delete site-images" ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
