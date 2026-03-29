create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  monthly_income numeric(12,2) not null check (monthly_income >= 0),
  monthly_expenses numeric(12,2) not null check (monthly_expenses >= 0),
  monthly_savings_goal numeric(12,2) not null check (monthly_savings_goal >= 0),
  risk_tolerance text not null check (risk_tolerance in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create table if not exists public.money_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('purchase', 'bill', 'loan', 'credit_card', 'subscription')),
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  interest_rate numeric(7,4) not null check (interest_rate >= 0),
  inflation_rate numeric(7,4) not null check (inflation_rate >= 0),
  months_to_payoff integer not null check (months_to_payoff > 0),
  budget_impact_percent numeric(8,2) not null check (budget_impact_percent >= 0),
  future_value_lost numeric(14,2) not null check (future_value_lost >= 0),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  regret_score integer not null check (regret_score between 0 and 100),
  recommendation text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_money_checks_updated_at on public.money_checks;
create trigger set_money_checks_updated_at
before update on public.money_checks
for each row
execute function public.set_updated_at();

create index if not exists idx_money_checks_user_created_at on public.money_checks (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.money_checks enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "money_checks_select_own" on public.money_checks;
create policy "money_checks_select_own" on public.money_checks
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "money_checks_insert_own" on public.money_checks;
create policy "money_checks_insert_own" on public.money_checks
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "money_checks_update_own" on public.money_checks;
create policy "money_checks_update_own" on public.money_checks
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "money_checks_delete_own" on public.money_checks;
create policy "money_checks_delete_own" on public.money_checks
for delete to authenticated using (auth.uid() = user_id);
