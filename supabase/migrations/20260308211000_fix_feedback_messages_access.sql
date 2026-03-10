grant insert on public.feedback_messages to anon, authenticated;
grant select on public.feedback_messages to authenticated;

drop policy if exists "Anyone can insert feedback messages" on public.feedback_messages;
drop policy if exists "Authenticated users can insert own feedback messages" on public.feedback_messages;
drop policy if exists "Guests can insert feedback messages" on public.feedback_messages;

create policy "Authenticated users can insert own feedback messages"
on public.feedback_messages
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Guests can insert feedback messages"
on public.feedback_messages
for insert
to anon
with check (user_id is null);
