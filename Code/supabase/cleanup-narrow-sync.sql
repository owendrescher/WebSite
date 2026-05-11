-- Optional cleanup after narrowing owentools sync scope.
-- Run in Supabase SQL Editor only if you want to remove old cloud rows that are
-- no longer used by the current sync configuration.

delete from public.tool_state
where tool_id = 'baseball-dashboard'
  and state_key not like 'player-tracker%'
  and state_key not like 'pending-game-picks%';

delete from public.tool_state
where tool_id = 'script-learning'
  and state_key not like '%-leaderboard';

delete from public.tool_state
where tool_id in (
  'book-reader',
  'nutrition-cost-analysis',
  'notepad-todo'
);
