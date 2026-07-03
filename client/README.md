# EduMind AI

An AI study assistant built with Next.js, Supabase (auth + database), and Google Gemini.

## What's here

- **Landing page** — hero, features, CTA, footer, "Continue with Google" login
- **Google login** via Supabase Auth (`/auth/callback` handles the redirect)
- **Dashboard** (`/dashboard`) — protected route, only visible when signed in
- **AI chat** — real messages sent to Gemini, saved to Supabase so history persists
- **Database schema** — `supabase/schema.sql`, run once in your Supabase project

## First-time setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
Open your Supabase project → **SQL Editor** → paste the contents of `../supabase/schema.sql` → **Run**.
This creates the `profiles`, `conversations`, and `messages` tables with proper security rules
(each user can only ever see their own data).

### 3. Enable Google login
Supabase dashboard → **Authentication → Providers → Google** → turn it on.
You'll need a Google OAuth Client ID/Secret — Supabase's docs walk through creating one:
https://supabase.com/docs/guides/auth/social-login/auth-google

Also add this as an authorized redirect URI in your Google Cloud OAuth settings:
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### 4. Get a free Gemini API key
Go to https://aistudio.google.com/apikey → **Create API Key**. It's free, no card required.

### 5. Environment variables
Copy `.env.local.example` to `.env.local` (already done for you here) and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=      # Supabase dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase dashboard → Settings → API
GEMINI_API_KEY=                # from step 4 above
```

### 6. Run it
```bash
npm run dev
```
Open http://localhost:3000

## Deploying

Vercel is the simplest option for a Next.js app like this:
1. Push this repo to GitHub
2. Import it at https://vercel.com/new
3. Add the same three environment variables in the Vercel project settings
4. In Supabase → Authentication → URL Configuration, add your live Vercel URL
   as an allowed **Redirect URL** (e.g. `https://your-app.vercel.app/auth/callback`)

## Project structure

```
src/app/
  page.tsx              landing page
  dashboard/page.tsx     protected dashboard + chat
  auth/callback/route.ts handles the Google login redirect
  api/chat/route.ts      calls Gemini, saves messages to Supabase
src/lib/supabase/
  client.ts              Supabase client for Client Components
  server.ts               Supabase client for Server Components / API routes
  middleware.ts           keeps login sessions alive, protects /dashboard
src/components/
  landing/                marketing page sections
  dashboard/               chat UI, logout button
  ui/                      shadcn components (button, card, input, etc.)
supabase/schema.sql        database tables + security rules
```
