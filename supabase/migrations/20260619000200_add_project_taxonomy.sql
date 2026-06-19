alter table public.airdrops add column if not exists project_category text;
alter table public.airdrops add column if not exists farming_strategy text;

update public.airdrops
set
  project_category = coalesce(
    project_category,
    case
      when type = 'AI' then 'AI'
      when type = 'DeFi' then 'DeFi'
      when type = 'Depin' then 'DePIN'
      when type = 'GameFi' then 'GameFi'
      when type in ('NFT', 'Deploy NFT') then 'NFT'
      else 'Other'
    end
  ),
  farming_strategy = coalesce(
    farming_strategy,
    case
      when type = 'Testnet' then 'Testnet'
      when type = 'Retroactive' then 'Retroactive'
      when type = 'Quest' then 'Quest'
      when type in ('Daily', 'Daily Quest') then 'Daily Check-in'
      when type = 'Waitlist' then 'Waitlist'
      when type = 'Node' then 'Node'
      else 'Unknown'
    end
  )
where project_category is null
   or farming_strategy is null;

create index if not exists airdrops_user_project_category_idx
  on public.airdrops(user_id, project_category);

create index if not exists airdrops_user_farming_strategy_idx
  on public.airdrops(user_id, farming_strategy);
