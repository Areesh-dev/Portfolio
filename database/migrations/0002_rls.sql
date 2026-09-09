-- ============================================================================
-- 0002_rls.sql
-- Row Level Security. The Express backend talks to Postgres with the
-- service-role key, which bypasses RLS entirely — these policies are a
-- second line of defense in case the anon key is ever queried directly
-- (e.g. future client-side reads), not the primary access-control path.
-- Every table gets RLS enabled; only clearly-public rows get an anon SELECT
-- policy. Nothing is ever writable by anon — all writes go through the
-- backend's admin-authorization middleware.
-- ============================================================================

alter table admin_profiles enable row level security;
alter table site_settings enable row level security;
alter table social_links enable row level security;
alter table services enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table education enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table upcoming_projects enable row level security;
alter table reviews enable row level security;
alter table contact_enquiries enable row level security;

-- admin_profiles: no anon access at all (not even read)
-- (no policy created => default deny for anon/authenticated under RLS)

-- site_settings: public read of the single row
create policy "site_settings_public_read"
  on site_settings for select
  to anon
  using (true);

-- social_links: public read of active links
create policy "social_links_public_read"
  on social_links for select
  to anon
  using (is_active = true);

-- services: public read of active services
create policy "services_public_read"
  on services for select
  to anon
  using (is_active = true);

-- skills: public read of active skills
create policy "skills_public_read"
  on skills for select
  to anon
  using (is_active = true);

-- experiences: public read (resume is inherently public once entered)
create policy "experiences_public_read"
  on experiences for select
  to anon
  using (true);

-- education: public read
create policy "education_public_read"
  on education for select
  to anon
  using (true);

-- projects: public read of published projects only
create policy "projects_public_read"
  on projects for select
  to anon
  using (is_published = true);

-- project_images: public read only when the parent project is published
create policy "project_images_public_read"
  on project_images for select
  to anon
  using (
    exists (
      select 1 from projects p
      where p.id = project_images.project_id
        and p.is_published = true
    )
  );

-- upcoming_projects: public read of published ones only
create policy "upcoming_projects_public_read"
  on upcoming_projects for select
  to anon
  using (is_published = true);

-- reviews: public read of approved reviews only
create policy "reviews_public_read"
  on reviews for select
  to anon
  using (is_approved = true);

-- contact_enquiries: NEVER publicly readable or writable directly.
-- Submissions are created by the backend (service role) after validation,
-- sanitization, and rate limiting. No policy => default deny.
