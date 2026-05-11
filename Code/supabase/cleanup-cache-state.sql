delete from public.tool_state
where tool_id = 'baseball-dashboard'
  and (
    state_key like 'games:%'
    or state_key like 'games-archive:%'
    or state_key like 'analytics-day:%'
    or state_key like 'hrs:%'
  );
