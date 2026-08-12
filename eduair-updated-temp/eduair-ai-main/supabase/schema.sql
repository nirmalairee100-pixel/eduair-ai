-- Run this once in your Supabase project:
-- Dashboard → SQL Editor → New query → paste this whole file → Run

-- Profiles: extra info about each user, auto-created on signup
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

-- Conversations: one row per chat session
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  created_at timestamptz default now()
);

-- Messages: every message in every conversation
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: users can only ever see/edit their own data
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own conversations" on conversations
  for select using (auth.uid() = user_id);
create policy "Users can create own conversations" on conversations
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own conversations" on conversations
  for delete using (auth.uid() = user_id);

create policy "Users can view own messages" on messages
  for select using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );
create policy "Users can insert own messages" on messages
  for insert with check (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Feature tables added for quiz / notes / PDF / study planner /
-- photo analysis. These were previously missing, which is why
-- those features were failing at runtime.
-- ─────────────────────────────────────────────────────────────

-- Quizzes: one row per generated quiz, plus the score once taken
create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  questions jsonb not null,
  total integer not null default 0,
  score integer,
  created_at timestamptz default now()
);

-- Notes: AI-generated study notes per topic
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Documents: PDF summaries
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  summary text not null,
  created_at timestamptz default now()
);

-- Study plans
create table if not exists study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Photo analyses: AI-analyzed images (homework help, diagrams, etc.)
create table if not exists photo_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  analysis text not null,
  created_at timestamptz default now()
);

-- Usage log: lightweight table for per-user rate limiting on AI calls.
-- One row per AI request; routes count rows in the last 24h.
create table if not exists usage_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  route text not null,
  created_at timestamptz default now()
);
create index if not exists usage_log_user_time_idx on usage_log (user_id, created_at desc);

alter table quizzes enable row level security;
alter table notes enable row level security;
alter table documents enable row level security;
alter table study_plans enable row level security;
alter table photo_analyses enable row level security;
alter table usage_log enable row level security;

create policy "Users can view own quizzes" on quizzes
  for select using (auth.uid() = user_id);
create policy "Users can create own quizzes" on quizzes
  for insert with check (auth.uid() = user_id);
create policy "Users can update own quizzes" on quizzes
  for update using (auth.uid() = user_id);
create policy "Users can delete own quizzes" on quizzes
  for delete using (auth.uid() = user_id);

create policy "Users can view own notes" on notes
  for select using (auth.uid() = user_id);
create policy "Users can create own notes" on notes
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own notes" on notes
  for delete using (auth.uid() = user_id);

create policy "Users can view own documents" on documents
  for select using (auth.uid() = user_id);
create policy "Users can create own documents" on documents
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own documents" on documents
  for delete using (auth.uid() = user_id);

create policy "Users can view own study plans" on study_plans
  for select using (auth.uid() = user_id);
create policy "Users can create own study plans" on study_plans
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own study plans" on study_plans
  for delete using (auth.uid() = user_id);

create policy "Users can view own photo analyses" on photo_analyses
  for select using (auth.uid() = user_id);
create policy "Users can create own photo analyses" on photo_analyses
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own photo analyses" on photo_analyses
  for delete using (auth.uid() = user_id);

create policy "Users can view own usage log" on usage_log
  for select using (auth.uid() = user_id);
create policy "Users can insert own usage log" on usage_log
  for insert with check (auth.uid() = user_id);
