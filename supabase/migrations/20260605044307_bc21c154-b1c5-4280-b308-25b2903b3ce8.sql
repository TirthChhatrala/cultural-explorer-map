
CREATE POLICY "Public read stories bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'stories');
CREATE POLICY "Public upload stories bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'stories');
CREATE POLICY "Public update stories bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'stories');
CREATE POLICY "Public delete stories bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'stories');
