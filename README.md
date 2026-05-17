# My-Portfolio — Setup Guide

## What's new in this version
- Full admin panel at `/admin` (login, dashboard, projects, services, about, blog, settings)
- All public pages now fetch live data from Supabase
- Supabase Auth protects the admin panel
- Admin not indexed by search engines (robots.txt updated)

---

## 1. Install dependencies

```bash
npm install
```

This now includes `@supabase/supabase-js`.

---

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **anon public key** (Settings → API)

---

## 3. Run the SQL setup

1. In your Supabase dashboard → SQL Editor
2. Open `supabase-setup.sql` from this project
3. Paste the entire file and click **Run**

This creates all tables, RLS policies, and seeds your existing data.

---

## 4. Create your admin account

In Supabase dashboard → Authentication → Users → **Add user**
- Enter your email and a strong password
- This is the only account that can log into `/admin`

---

## 5. Add environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your values:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 6. Run locally

```bash
npm run dev
```

Visit:
- `http://localhost:5173` — public portfolio
- `http://localhost:5173/admin/login` — admin panel

---

## 7. Deploy

Build for production:
```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

**Important:** Add your environment variables in your hosting platform's dashboard too.

---

## Admin panel features

| Page | What you can do |
|---|---|
| `/admin/projects` | Add, edit, delete projects with all case study fields |
| `/admin/services` | Add, edit, delete service cards |
| `/admin/about` | Edit bio paragraphs, skills & levels, tech stack, education |
| `/admin/blog` | Write posts, toggle draft/published, delete |
| `/admin/settings` | Site name, social links, stats, available-for-work badge |
