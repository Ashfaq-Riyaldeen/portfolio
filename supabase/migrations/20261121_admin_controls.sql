-- Decimal highlights and atomic section layout saves. Safe to apply again.
begin;

alter table public.stats alter column value type numeric using value::numeric;

create or replace function public.save_section_layout(updates jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  section_count integer;
  changed_count integer;
begin
  if auth.uid() is null then
    raise exception 'Not signed in.' using errcode = '42501';
  end if;
  if jsonb_typeof(updates) is distinct from 'array' then
    raise exception 'Invalid section layout.' using errcode = '22023';
  end if;

  -- Lock the complete layout so concurrent saves cannot interleave their rows.
  perform key from public.sections order by key for update;
  select count(*) into section_count from public.sections;
  if section_count = 0 or jsonb_array_length(updates) <> section_count then
    raise exception 'The section list changed. Refresh and try again.' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(updates) as item
    where jsonb_typeof(item->'key') is distinct from 'string'
       or jsonb_typeof(item->'visible') is distinct from 'boolean'
       or jsonb_typeof(item->'sortOrder') is distinct from 'number'
       or (item->>'sortOrder') !~ '^[0-9]+$'
  ) then
    raise exception 'Invalid section fields.' using errcode = '22023';
  end if;
  if (
    select count(distinct u.key) = section_count
       and count(distinct u."sortOrder") = section_count
       and min(u."sortOrder") = 1 and max(u."sortOrder") = section_count
       and count(s.key) = section_count
    from jsonb_to_recordset(updates) as u(key text, visible boolean, "sortOrder" integer)
    left join public.sections s on s.key = u.key
  ) is not true then
    raise exception 'Invalid or duplicate section order.' using errcode = '22023';
  end if;

  update public.sections s
  set visible = u.visible, sort_order = u."sortOrder"
  from jsonb_to_recordset(updates) as u(key text, visible boolean, "sortOrder" integer)
  where s.key = u.key;
  get diagnostics changed_count = row_count;
  if changed_count <> section_count then
    raise exception 'The complete layout could not be saved.';
  end if;
end;
$$;

revoke all on function public.save_section_layout(jsonb) from public, anon;
grant execute on function public.save_section_layout(jsonb) to authenticated;

commit;
