-- ============================================================
-- PORTFOLIO SUPABASE SETUP
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- PROJECTS
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  tags text[],
  color text default '#7c3aed',
  icon text,
  highlights text[],
  problem text,
  solution text,
  process text,
  results text,
  live_url text,
  code_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- SERVICES
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  icon text,
  title text not null,
  description text,
  color text default '#7c3aed',
  sort_order int default 0
);

-- ABOUT (single row)
create table if not exists about (
  id uuid primary key default gen_random_uuid(),
  bio1 text,
  bio2 text,
  bio3 text,
  tagline text,
  location text,
  cv_url text,
  skills jsonb,      -- [{ "name": "React", "level": 88 }]
  stack jsonb,       -- ["React", "Node.js", ...]
  education jsonb    -- [{ "year": "2023", "title": "...", "sub": "..." }]
);

-- BLOG POSTS
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text,
  tag text,
  read_time text,
  color text default '#06b6d4',
  excerpt text,
  content text,
  published boolean default false,
  created_at timestamptz default now()
);

-- SETTINGS (key-value store)
create table if not exists settings (
  key text primary key,
  value text
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table projects enable row level security;
alter table services enable row level security;
alter table about enable row level security;
alter table blog_posts enable row level security;
alter table settings enable row level security;

-- Public can read all (portfolio is public)
create policy "Public read projects"   on projects   for select using (true);
create policy "Public read services"   on services   for select using (true);
create policy "Public read about"      on about      for select using (true);
create policy "Public read blog"       on blog_posts for select using (published = true);
create policy "Public read settings"   on settings   for select using (true);

-- Only authenticated users (you) can write
create policy "Auth all projects"   on projects   for all using (auth.role() = 'authenticated');
create policy "Auth all services"   on services   for all using (auth.role() = 'authenticated');
create policy "Auth all about"      on about      for all using (auth.role() = 'authenticated');
create policy "Auth all blog"       on blog_posts for all using (auth.role() = 'authenticated');
create policy "Auth all settings"   on settings   for all using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (your existing portfolio content)
-- ============================================================

-- Seed projects
insert into projects (title, subtitle, description, tags, color, icon, highlights, problem, solution, process, results, live_url, code_url, sort_order) values
(
  'ChuoFund', 'Scholarship Discovery App',
  'A free scholarship discovery platform for Kenyan students — aggregating 54+ funding opportunities across all 47 counties, with smart matching and SMS deadline reminders.',
  array['React','Vite','Supabase','Africa''s Talking','Capacitor'],
  '#22c55e', '📚',
  array['54+ scholarships & bursaries aggregated','Covers all 47 counties in Kenya','Smart student-to-scholarship matching','SMS deadline reminders via Africa''s Talking'],
  'Billions of shillings in scholarships and bursaries go unclaimed every year in Kenya because students simply don''t know they exist.',
  'ChuoFund aggregates 54+ funding opportunities and matches students to programs they actually qualify for. SMS reminders ensure no deadline is missed. 100% free for students.',
  'Built solo from scratch. React + Vite PWA frontend with Supabase as the live database. Capacitor for Android packaging. Africa''s Talking API for SMS delivery.',
  'Currently in beta with 54+ listed programs spanning all 47 counties including HELB, HEF, NG-CDF, Wings to Fly, Mastercard Foundation Scholars, and all 47 county bursary programs.',
  '#', '#', 0
),
(
  'Kenya Yetu', 'Digital Savings Platform',
  'A fintech platform targeting small-scale Kenyan traders (mama mboga) with tiered savings packages, M-Pesa integration, referral system, and an admin panel.',
  array['React','Vite','M-Pesa API','Node.js'],
  '#06b6d4', '🏦',
  array['M-Pesa Daraja API integration','Tiered savings packages','Referral & rewards system','Admin panel with analytics'],
  'Informal traders in Kenya lack access to structured savings tools that align with their daily cash flow patterns and M-Pesa-based transactions.',
  'A mobile-first savings platform with flexible deposit tiers, automated M-Pesa STK Push, and a referral system to grow organically within trader communities.',
  'Built with Vite + React on the frontend, Node.js backend for Daraja API integration.',
  'Prototype validated with 5 pilot traders. Referral system achieved 3x organic user growth in the first month of beta testing.',
  '#', '#', 1
),
(
  'Nyumba', 'Apartment Management App',
  'A React Native + Expo + Supabase apartment management system for the Kenyan rental market, supporting tenant and landlord roles with role-based navigation.',
  array['React Native','Expo','Supabase','Daraja API'],
  '#ec4899', '🏠',
  array['Dual role: Tenant & Landlord','Supabase RLS security policies','M-Pesa rent payment (Phase 2)','Cross-platform iOS & Android'],
  'Kenyan landlords manage rent collections manually via WhatsApp and M-Pesa messages — error-prone and time-consuming.',
  'A role-based mobile app where landlords manage units and tenants pay rent digitally.',
  'Scaffolded with Expo Router for navigation, Supabase for auth + database with Row Level Security policies.',
  'Phase 1 complete and deployed. Clean architecture ready for M-Pesa integration in Phase 2. Positive feedback from 3 test landlords.',
  '#', '#', 2
),
(
  'TaskHive', 'Productivity & Task Manager',
  'A sleek task management platform with hive-mind collaboration features, real-time updates, intelligent task prioritization, and a beautiful dark UI.',
  array['React','Firebase','Tailwind','Framer Motion'],
  '#f59e0b', '🐝',
  array['Real-time sync across devices','Team collaboration boards','Smart priority algorithm','Dark / Light mode toggle'],
  'Existing task managers are bloated with features that slow down small teams.',
  'A minimal yet powerful task board with real-time Firebase sync, drag-and-drop task management, priority scoring, and team workspaces.',
  'Designed in Figma with a honeycomb-inspired aesthetic. Built with React + Firebase Realtime DB. Framer Motion for smooth animations.',
  'Used by 3 student teams at Kirinyaga University. 92% task completion rate among active users.',
  '#', '#', 3
);

-- Seed services
insert into services (icon, title, description, color, sort_order) values
('</>',  'Web Development',  'High-performance full-stack web applications built with modern frameworks, scalable architecture, and clean code practices.', '#7c3aed', 0),
('✦',   'UI/UX Design',     'Clean, intuitive, and engaging interfaces that elevate user experience, drive engagement, and look stunning across all devices.', '#06b6d4', 1),
('📱',  'Mobile Apps',      'Cross-platform mobile applications built with React Native and Expo that are fast, reliable, and natively performant.', '#ec4899', 2),
('☁️',  'Cloud & Backend',  'Scalable backend systems, cloud deployments, API integrations, and database architecture built for production environments.', '#3b82f6', 3),
('🤖',  'AI Integrations',  'Embed intelligent AI features into your products — from conversational chatbots to data analysis pipelines and automation.', '#10b981', 4),
('🔒',  'Security Audits',  'Web app penetration testing, SQL injection & vulnerability assessment, and hardening recommendations for your systems.', '#f59e0b', 5);

-- Seed settings
insert into settings (key, value) values
('site_name',         'Kelvin Maina Mucheru'),
('site_tagline',      'Full-Stack Developer based in Kenya'),
('available_for_work','true'),
('stats_experience',  '3+'),
('stats_projects',    '20+'),
('stats_clients',     '10+'),
('github',            'https://github.com/kmmucheru'),
('linkedin',          ''),
('twitter',           ''),
('whatsapp',          '');

-- ============================================================
-- MESSAGES (contact form submissions)
-- ============================================================

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;

-- Anyone can submit a message (public insert)
create policy "Public insert messages" on messages for insert with check (true);

-- Only authenticated admin can read, update, delete
create policy "Auth read messages"   on messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on messages for update using (auth.role() = 'authenticated');
create policy "Auth delete messages" on messages for delete using (auth.role() = 'authenticated');
