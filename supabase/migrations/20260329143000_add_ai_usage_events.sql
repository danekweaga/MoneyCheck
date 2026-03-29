create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('chatbot')),
  credits_used integer not null default 1 check (credits_used > 0),
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_events_user_created_idx
  on public.ai_usage_events (user_id, created_at desc);

alter table public.ai_usage_events enable row level security;

create policy if not exists "Users can read own ai usage events"
  on public.ai_usage_events
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Users can insert own ai usage events"
  on public.ai_usage_events
  for insert
  to authenticated
  with check (auth.uid() = user_id);
