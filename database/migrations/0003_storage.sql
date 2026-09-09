-- ============================================================================
-- 0003_storage.sql
-- Storage buckets. All uploads/deletes go through the Express backend using
-- the service-role key (which bypasses storage RLS), gated by the admin
-- auth middleware — so no anon INSERT/UPDATE/DELETE policies are needed.
-- Buckets are marked public so uploaded images/resume can be served
-- directly via their public URL without a signed-URL round trip.
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('project-screenshots', 'project-screenshots', true),
  ('service-images', 'service-images', true),
  ('resume', 'resume', true),
  ('review-images', 'review-images', true)
on conflict (id) do nothing;

-- Public read for every object in these buckets (belt-and-suspenders on top
-- of `public = true`, and required if you ever flip a bucket to private).
create policy "public_read_profile_images"
  on storage.objects for select to anon
  using (bucket_id = 'profile-images');

create policy "public_read_project_images"
  on storage.objects for select to anon
  using (bucket_id = 'project-images');

create policy "public_read_project_screenshots"
  on storage.objects for select to anon
  using (bucket_id = 'project-screenshots');

create policy "public_read_service_images"
  on storage.objects for select to anon
  using (bucket_id = 'service-images');

create policy "public_read_resume"
  on storage.objects for select to anon
  using (bucket_id = 'resume');

create policy "public_read_review_images"
  on storage.objects for select to anon
  using (bucket_id = 'review-images');

-- No insert/update/delete policies for anon or authenticated: only the
-- service-role key (used exclusively by the backend) can write, and
-- service-role always bypasses RLS.
