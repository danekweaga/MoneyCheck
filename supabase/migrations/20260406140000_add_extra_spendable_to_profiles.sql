alter table public.profiles
  add column if not exists extra_spendable numeric(12,2) not null default 0
    check (extra_spendable >= 0);
