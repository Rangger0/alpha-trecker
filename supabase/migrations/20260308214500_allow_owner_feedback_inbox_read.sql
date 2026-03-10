drop policy if exists "Owner can read entire feedback inbox" on public.feedback_messages;

create policy "Owner can read entire feedback inbox"
on public.feedback_messages
for select
to authenticated
using (
  lower(
    coalesce(
      auth.jwt() ->> 'email',
      auth.jwt() -> 'user_metadata' ->> 'email',
      auth.jwt() -> 'user_metadata' ->> 'preferred_email',
      auth.jwt() -> 'app_metadata' ->> 'email',
      ''
    )
  ) = 'allgazali011@gmail.com'
);
