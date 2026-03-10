alter table public.airdrop_rewards
  add column if not exists capital_usd numeric(18, 2) not null default 0,
  add column if not exists fee_usd numeric(18, 2) not null default 0;

update public.airdrop_rewards
set
  capital_usd = coalesce(capital_usd, 0),
  fee_usd = coalesce(fee_usd, 0)
where capital_usd is null or fee_usd is null;
