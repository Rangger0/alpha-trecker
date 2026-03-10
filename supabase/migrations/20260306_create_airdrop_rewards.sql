create extension if not exists pgcrypto;

create table if not exists public.airdrop_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  airdrop_id uuid not null references public.airdrops(id) on delete cascade,
  claim_status text not null check (claim_status in ('Pending TGE', 'Claimed', 'Missed')),
  amount_usd numeric(18, 2) not null default 0,
  token_amount numeric(36, 18),
  token_symbol text,
  tge_date date,
  claimed_at date,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, airdrop_id)
);

create index if not exists idx_airdrop_rewards_user_id on public.airdrop_rewards(user_id);
create index if not exists idx_airdrop_rewards_airdrop_id on public.airdrop_rewards(airdrop_id);

alter table public.airdrop_rewards enable row level security;

drop policy if exists "Users can read own airdrop rewards" on public.airdrop_rewards;
create policy "Users can read own airdrop rewards"
on public.airdrop_rewards
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own airdrop rewards" on public.airdrop_rewards;
create policy "Users can insert own airdrop rewards"
on public.airdrop_rewards
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own airdrop rewards" on public.airdrop_rewards;
create policy "Users can update own airdrop rewards"
on public.airdrop_rewards
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own airdrop rewards" on public.airdrop_rewards;
create policy "Users can delete own airdrop rewards"
on public.airdrop_rewards
for delete
using (auth.uid() = user_id);
