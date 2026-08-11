create table if not exists public.portfolio_transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  transaction_date date not null,
  category text not null,
  currency text not null check (currency in ('IDR', 'USD', 'USDT', 'USDC')),
  amount numeric not null check (amount >= 0),
  wallet text not null,
  source text,
  note text,
  attachment_url text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  asset_type text not null check (asset_type in ('cash', 'bank', 'idr', 'usd', 'usdt', 'usdc', 'btc', 'eth', 'sol')),
  label text not null,
  currency text not null check (currency in ('IDR', 'USD', 'USDT', 'USDC')),
  balance numeric not null default 0 check (balance >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_transactions_owner_date_idx
  on public.portfolio_transactions(owner_id, transaction_date desc, created_at desc);

create index if not exists portfolio_transactions_owner_type_idx
  on public.portfolio_transactions(owner_id, type, deleted_at);

create index if not exists portfolio_assets_owner_type_idx
  on public.portfolio_assets(owner_id, asset_type);

alter table public.portfolio_transactions enable row level security;
alter table public.portfolio_assets enable row level security;

drop policy if exists "Users can read own portfolio transactions" on public.portfolio_transactions;
create policy "Users can read own portfolio transactions"
  on public.portfolio_transactions for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert own portfolio transactions" on public.portfolio_transactions;
create policy "Users can insert own portfolio transactions"
  on public.portfolio_transactions for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users can update own portfolio transactions" on public.portfolio_transactions;
create policy "Users can update own portfolio transactions"
  on public.portfolio_transactions for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own portfolio transactions" on public.portfolio_transactions;
create policy "Users can delete own portfolio transactions"
  on public.portfolio_transactions for delete
  using (auth.uid() = owner_id);

drop policy if exists "Users can read own portfolio assets" on public.portfolio_assets;
create policy "Users can read own portfolio assets"
  on public.portfolio_assets for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert own portfolio assets" on public.portfolio_assets;
create policy "Users can insert own portfolio assets"
  on public.portfolio_assets for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users can update own portfolio assets" on public.portfolio_assets;
create policy "Users can update own portfolio assets"
  on public.portfolio_assets for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own portfolio assets" on public.portfolio_assets;
create policy "Users can delete own portfolio assets"
  on public.portfolio_assets for delete
  using (auth.uid() = owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_transactions_set_updated_at on public.portfolio_transactions;
create trigger portfolio_transactions_set_updated_at
  before update on public.portfolio_transactions
  for each row
  execute function public.set_updated_at();

drop trigger if exists portfolio_assets_set_updated_at on public.portfolio_assets;
create trigger portfolio_assets_set_updated_at
  before update on public.portfolio_assets
  for each row
  execute function public.set_updated_at();
