create extension if not exists pgcrypto;

create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  route text not null,
  page_url text not null,
  message text not null check (char_length(trim(message)) >= 8),
  contact text,
  user_email text,
  source text not null default 'floating_widget' check (source in ('floating_widget')),
  status text not null default 'pending' check (status in ('pending', 'notified', 'notification_failed')),
  notification_attempts integer not null default 0 check (notification_attempts >= 0),
  notification_error text,
  notified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_feedback_messages_user_id
  on public.feedback_messages(user_id);

create index if not exists idx_feedback_messages_status_created_at
  on public.feedback_messages(status, created_at desc);

create or replace function public.touch_feedback_messages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_feedback_messages_updated_at on public.feedback_messages;
create trigger set_feedback_messages_updated_at
before update on public.feedback_messages
for each row
execute function public.touch_feedback_messages_updated_at();

alter table public.feedback_messages enable row level security;

drop policy if exists "Users can read own feedback messages" on public.feedback_messages;
create policy "Users can read own feedback messages"
on public.feedback_messages
for select
using (auth.uid() = user_id);

drop policy if exists "Anyone can insert feedback messages" on public.feedback_messages;
create policy "Anyone can insert feedback messages"
on public.feedback_messages
for insert
with check (
  (auth.uid() = user_id)
  or (auth.uid() is null and user_id is null)
);
