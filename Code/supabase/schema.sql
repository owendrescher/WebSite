create table if not exists public.tool_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_id text not null,
  state_key text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, tool_id, state_key)
);

alter table public.tool_state enable row level security;

drop policy if exists "Users can read own tool state" on public.tool_state;
create policy "Users can read own tool state"
on public.tool_state for select
using (auth.uid() = user_id);

drop policy if exists "Users can write own tool state" on public.tool_state;
create policy "Users can write own tool state"
on public.tool_state for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own tool state" on public.tool_state;
create policy "Users can update own tool state"
on public.tool_state for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own tool state" on public.tool_state;
create policy "Users can delete own tool state"
on public.tool_state for delete
using (auth.uid() = user_id);
