-- Optional recovery only. Do NOT run after a successful repair as a setup step.
-- Restores the captured content, keeping the compatible additive schema.
-- Refuses to overwrite ANY later content edit; retain the snapshot for manual recovery instead.
begin;
do $rollback$
declare
  snapshot portfolio_maintenance.repairs%rowtype;
  table_name text;
  primary_key text;
  current_rows jsonb;
  restored_rows jsonb;
  column_names text;
  assignments text;
begin
  lock table public.profile, public.site_settings, public.sections, public.stats, public.education, public.skill_categories, public.projects, public.publications, public.experience, public.certifications, public.achievements, public.coding_profiles, public.volunteering, public.languages, public.blog_posts in share row exclusive mode;
  select * into snapshot from portfolio_maintenance.repairs where revision = '20261122_admin_repair' for update;
  if not found then raise exception 'No repair snapshot exists. Nothing was restored.'; end if;
  if snapshot.rolled_back_at is not null then raise notice 'Already restored. No content changed.'; return; end if;
  for table_name in select jsonb_object_keys(snapshot.after_rows) loop
    primary_key := case when table_name = 'sections' then 'key' else 'id' end;
    execute format('select coalesce(jsonb_agg(to_jsonb(t) order by t.%I), ''[]''::jsonb) from public.%I t',primary_key,table_name) into current_rows;
    if current_rows is distinct from snapshot.after_rows->table_name then
      raise exception 'Content in % changed after the repair. Automatic rollback cancelled to protect newer edits.',table_name;
    end if;
  end loop;
  for table_name in select jsonb_object_keys(snapshot.before_rows) loop
    primary_key := case when table_name = 'sections' then 'key' else 'id' end;
    restored_rows := snapshot.before_rows->table_name;
    execute format('delete from public.%I t where not exists (select 1 from jsonb_array_elements($1) b where b->>%L = t.%I::text)',table_name,primary_key,primary_key) using restored_rows;
    if jsonb_array_length(restored_rows) > 0 then
      select string_agg(format('%I',key),', ' order by key),
             string_agg(format('%I = excluded.%I',key,key),', ' order by key) filter (where key <> primary_key)
        into column_names,assignments from jsonb_object_keys(restored_rows->0) as key;
      execute format('insert into public.%I (%s) select %s from jsonb_populate_recordset(null::public.%I,$1) on conflict (%I) do update set %s',table_name,column_names,column_names,table_name,primary_key,assignments) using restored_rows;
      if table_name = 'projects' and not ((restored_rows->0) ? 'categories') then
        update public.projects set categories = '{}';
      end if;
    end if;
  end loop;
  update portfolio_maintenance.repairs set rolled_back_at = now() where revision = '20261122_admin_repair';
end;
$rollback$;
notify pgrst, 'reload schema';
commit;
