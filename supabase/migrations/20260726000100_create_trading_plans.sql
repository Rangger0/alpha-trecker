create table if not exists public.trading_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  trade_date date not null,
  trade_time time not null,
  coin text not null default 'BTC',
  custom_coin text,
  exchange text not null default 'Binance',
  trading_type text not null default 'Swing',
  direction text not null default 'Long' check (direction in ('Long', 'Short')),
  timeframe text not null default '1H',
  reason text not null default '',
  additional_notes text,
  market_trend text not null default 'Bullish',
  market_structure text not null default 'HH HL',
  volume text not null default 'Normal',
  liquidity text not null default 'Above High',
  bias text not null default 'Bullish',
  confluences text[] not null default '{}',
  entry_price numeric not null default 0,
  stop_loss numeric not null default 0,
  take_profit_1 numeric not null default 0,
  take_profit_2 numeric not null default 0,
  take_profit_3 numeric not null default 0,
  invalidation numeric not null default 0,
  expected_win_rate numeric not null default 0,
  confidence numeric not null default 0,
  risk_reward numeric not null default 0,
  capital numeric not null default 0,
  risk_percent numeric not null default 1,
  risk_amount numeric not null default 0,
  position_size numeric not null default 0,
  leverage numeric not null default 1,
  margin_used numeric not null default 0,
  potential_profit numeric not null default 0,
  potential_loss numeric not null default 0,
  break_even_price numeric not null default 0,
  liquidation_price numeric not null default 0,
  emotion text not null default 'Calm',
  psychology_checklist text[] not null default '{}',
  news text,
  news_impact text not null default 'Low Impact',
  trade_checklist text[] not null default '{}',
  ai_summary text not null default '',
  trade_status text not null default 'Pending' check (trade_status in ('Pending', 'Running', 'Closed')),
  trade_result text not null default 'Pending' check (trade_result in ('Win', 'Loss', 'Break Even', 'Pending')),
  pnl numeric not null default 0,
  profit_percent numeric not null default 0,
  loss_percent numeric not null default 0,
  lessons_learned text,
  mistakes text,
  before_screenshot text,
  after_screenshot text,
  tags text[] not null default '{}',
  notes text
);

create index if not exists trading_plans_user_date_idx
  on public.trading_plans(user_id, trade_date desc, trade_time desc);

create index if not exists trading_plans_user_coin_idx
  on public.trading_plans(user_id, coin);

alter table public.trading_plans enable row level security;

drop policy if exists "Users can read own trading plans" on public.trading_plans;
create policy "Users can read own trading plans"
  on public.trading_plans for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own trading plans" on public.trading_plans;
create policy "Users can insert own trading plans"
  on public.trading_plans for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own trading plans" on public.trading_plans;
create policy "Users can update own trading plans"
  on public.trading_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own trading plans" on public.trading_plans;
create policy "Users can delete own trading plans"
  on public.trading_plans for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trading_plans_set_updated_at on public.trading_plans;
create trigger trading_plans_set_updated_at
  before update on public.trading_plans
  for each row
  execute function public.set_updated_at();
