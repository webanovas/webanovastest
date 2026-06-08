DROP POLICY IF EXISTS "Admins manage special_classes" ON public.special_classes;
CREATE POLICY "Admins manage special_classes" ON public.special_classes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));