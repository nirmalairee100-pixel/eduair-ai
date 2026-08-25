-- Model Question Sets: AI-generated NEB/SEE-pattern model papers.
-- Structure mirrors the `quizzes` table pattern already in schema.sql.

create table if not exists model_question_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  class_level text not null,        -- '8' | '10' | '12'
  faculty text,                     -- only set for class 12 (Science/Management/Humanities)
  subject text not null,
  sections jsonb not null,          -- [{ group, instructions, marksEach, questions: [...] }]
  full_marks integer not null default 0,
  pass_marks integer,
  time_allowed text,                -- e.g. "3 hrs"
  created_at timestamptz default now()
);

alter table model_question_sets enable row level security;

create policy "Users can view own model question sets" on model_question_sets
  for select using (auth.uid() = user_id);
create policy "Users can create own model question sets" on model_question_sets
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own model question sets" on model_question_sets
  for delete using (auth.uid() = user_id);
