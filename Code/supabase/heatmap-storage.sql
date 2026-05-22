insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mlb-heatmaps',
  'mlb-heatmaps',
  true,
  104857600,
  array['text/csv', 'text/plain', 'application/vnd.ms-excel']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read access for MLB heatmaps'
  ) then
    create policy "Public read access for MLB heatmaps"
      on storage.objects
      for select
      to public
      using (bucket_id = 'mlb-heatmaps');
  end if;
end $$;
