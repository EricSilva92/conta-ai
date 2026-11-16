create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null
    and not public.has_role(auth.uid(), 'admin')
    and (
      new.id is distinct from old.id
      or new.full_name is distinct from old.full_name
      or new.email is distinct from old.email
      or new.ai_enabled is distinct from old.ai_enabled
      or new.stress_level is distinct from old.stress_level
      or new.created_at is distinct from old.created_at
    )
  then
    raise exception 'Users may only update their own activity timestamp'
      using errcode = '42501';
  end if;

  return new;
end;
$$;
--> statement-breakpoint
create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();
--> statement-breakpoint
create or replace function public.allow_ai_reply_if_enabled()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  enabled boolean;
begin
  if new.sender <> 'ai' then
    return new;
  end if;

  select ai_enabled into enabled
  from public.profiles
  where id = new.client_id
  for update;

  if not coalesce(enabled, false) then
    return null;
  end if;

  return new;
end;
$$;
--> statement-breakpoint
create trigger allow_ai_reply_if_enabled
  before insert on public.messages
  for each row execute function public.allow_ai_reply_if_enabled();
