create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null,
  project_name text,
  address text,
  wallet_address text,
  label text,
  notes text,
  network text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wallets add column if not exists project_name text;
alter table public.wallets add column if not exists address text;
alter table public.wallets add column if not exists wallet_address text;
alter table public.wallets add column if not exists label text;
alter table public.wallets add column if not exists notes text;
alter table public.wallets add column if not exists network text;
alter table public.wallets add column if not exists archived boolean not null default false;
alter table public.wallets add column if not exists updated_at timestamptz;

update public.wallets
set address = coalesce(address, wallet_address),
    wallet_address = coalesce(wallet_address, address),
    updated_at = coalesce(updated_at, created_at, now())
where address is null
   or wallet_address is null
   or updated_at is null;

alter table public.wallets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'wallets'
      and policyname = 'wallets_select_own'
  ) then
    create policy wallets_select_own
      on public.wallets for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'wallets'
      and policyname = 'wallets_insert_own'
  ) then
    create policy wallets_insert_own
      on public.wallets for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'wallets'
      and policyname = 'wallets_update_own'
  ) then
    create policy wallets_update_own
      on public.wallets for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'wallets'
      and policyname = 'wallets_delete_own'
  ) then
    create policy wallets_delete_own
      on public.wallets for delete
      using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists wallets_user_project_idx on public.wallets(user_id, project_id);
create index if not exists wallets_user_network_idx on public.wallets(user_id, network);

do $$
declare
  existing_project_fk text;
begin
  select constraint_name
  into existing_project_fk
  from information_schema.key_column_usage
  where table_schema = 'public'
    and table_name = 'wallets'
    and column_name = 'project_id'
    and constraint_name in (
      select tc.constraint_name
      from information_schema.table_constraints tc
      where tc.table_schema = 'public'
        and tc.table_name = 'wallets'
        and tc.constraint_type = 'FOREIGN KEY'
    )
  limit 1;

  if existing_project_fk is not null then
    execute format('alter table public.wallets drop constraint %I', existing_project_fk);
  end if;

  if to_regclass('public.airdrops') is not null and not exists (
    select 1
    from pg_constraint
    where conname = 'wallets_project_id_fkey'
      and conrelid = 'public.wallets'::regclass
  ) then
    alter table public.wallets
      add constraint wallets_project_id_fkey
      foreign key (project_id)
      references public.airdrops(id)
      on delete cascade;
  end if;
end $$;
