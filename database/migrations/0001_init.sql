-- ============================================================================
-- 0001_init.sql
-- Core schema for the portfolio: tables, constraints, indexes, updated_at
-- triggers. Run this in the Supabase SQL editor (or via `supabase db push`)
-- before 0002_rls.sql and 0003_storage.sql.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- admin_profiles — mirrors the single Supabase Auth admin user
-- ---------------------------------------------------------------------------
create table admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- site_settings — single-row table for hero/about/contact copy
-- ---------------------------------------------------------------------------
create table site_settings (
  id smallint primary key default 1,
  site_title text,
  site_tagline text,
  hero_heading text,
  hero_subheading text,
  hero_intro text,
  hero_image_url text,
  about_heading text,
  about_description text,
  about_image_url text,
  about_philosophy text,
  about_learning_journey text,
  contact_email text,
  contact_phone text,
  contact_location text,
  resume_file_url text,
  seo_meta_description text,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into site_settings (id) values (1);

create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- social_links
-- ---------------------------------------------------------------------------
create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('github','linkedin','instagram','twitter','email','website','other')),
  url text not null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_social_links_updated_at
  before update on social_links
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------------
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_active_order on services (is_active, display_order);

create trigger trg_services_updated_at
  before update on services
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------------------
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Frontend','Backend','Database','Cloud','Tools','UI/UX','Other')),
  proficiency int check (proficiency between 0 and 100),
  icon text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_skills_active_order on skills (is_active, display_order);
create index idx_skills_category on skills (category);

create trigger trg_skills_updated_at
  before update on skills
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- experiences
-- ---------------------------------------------------------------------------
create table experiences (
  id uuid primary key default gen_random_uuid(),
  position text not null,
  organization text not null,
  start_date date not null,
  end_date date,
  description text,
  location text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_experiences_order on experiences (display_order);

create trigger trg_experiences_updated_at
  before update on experiences
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------
create table education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  start_date date not null,
  end_date date,
  description text,
  location text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_education_order on education (display_order);

create trigger trg_education_updated_at
  before update on education
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  featured_image text,
  category text,
  technologies text[] not null default '{}',
  github_url text,
  live_url text,
  project_date date,
  featured boolean not null default false,
  display_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_published_order on projects (is_published, display_order);
create index idx_projects_slug on projects (slug);
create index idx_projects_featured on projects (featured) where featured = true;

create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- project_images — extra screenshots per project
-- ---------------------------------------------------------------------------
create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_project_images_project on project_images (project_id, display_order);

-- ---------------------------------------------------------------------------
-- upcoming_projects
-- ---------------------------------------------------------------------------
create table upcoming_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  technologies text[] not null default '{}',
  status text not null default 'planning' check (status in ('planning','in-progress','on-hold')),
  timeline text,
  progress int not null default 0 check (progress between 0 and 100),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_upcoming_projects_published on upcoming_projects (is_published);

create trigger trg_upcoming_projects_updated_at
  before update on upcoming_projects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  company text,
  profile_image text,
  review_text text not null,
  rating int not null check (rating between 1 and 5),
  submitted_at timestamptz not null default now(),
  is_approved boolean not null default false
);

create index idx_reviews_approved on reviews (is_approved, submitted_at desc);

-- ---------------------------------------------------------------------------
-- contact_enquiries
-- ---------------------------------------------------------------------------
create table contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_enquiries_status on contact_enquiries (status, created_at desc);

create trigger trg_enquiries_updated_at
  before update on contact_enquiries
  for each row execute function set_updated_at();
