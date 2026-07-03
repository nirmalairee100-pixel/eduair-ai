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
