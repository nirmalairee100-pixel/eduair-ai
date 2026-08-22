-- Adds Pro entitlement fields to profiles. Run this in the Supabase SQL editor
-- (project fngydafriblpebwhmjqz) before deploying the rate-limit changes.

alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro')),
  add column if not exists pro_expires_at timestamptz;

-- authenticated users need to be able to read their own plan (they already
-- have a select policy on profiles for full_name etc, but re-grant to be safe)
grant select on public.profiles to authenticated;

-- Helper index for the manual-activation lookups you'll run by email.
create index if not exists profiles_plan_idx on public.profiles (plan);

-- === HOW TO MANUALLY ACTIVATE A PRO USER ===
-- After a student pays via eSewa/Khalti and messages you their email:
--
-- update public.profiles
-- set plan = 'pro', pro_expires_at = now() + interval '30 days'
-- where id = (select id from auth.users where email = 'student@email.com');
--
-- To check who's currently Pro and when they expire:
-- select p.id, u.email, p.plan, p.pro_expires_at
-- from public.profiles p join auth.users u on u.id = p.id
-- where p.plan = 'pro'
-- order by p.pro_expires_at asc;
