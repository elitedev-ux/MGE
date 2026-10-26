-- Transactional tests: create no lasting sessions or login failures.
begin;
set local role service_role;
do $$
declare result jsonb;
begin
  for i in 1..5 loop
    result := public.mge_admin_login('intentionally-wrong-test-password','mge-security-verification');
    if (result->>'status')::integer <> 401 then raise exception 'Wrong password was not rejected'; end if;
  end loop;
  result := public.mge_admin_login('intentionally-wrong-test-password','mge-security-verification');
  if (result->>'status')::integer <> 429 then raise exception 'Rate limit did not activate'; end if;
  insert into mge_private.admin_sessions(token_hash,expires_at)
  values (encode(extensions.digest('expired-verification-token','sha256'),'hex'),now()-interval '1 second');
  if public.mge_admin_authorize('expired-verification-token') then raise exception 'Expired token was accepted'; end if;
  if has_function_privilege('anon','public.mge_admin_login(text,text)','execute') then raise exception 'Public RPC access'; end if;
  if has_table_privilege('anon','public.products','update') then raise exception 'Public write access'; end if;
  if has_schema_privilege('anon','mge_private','usage') then raise exception 'Private schema exposed'; end if;
end;
$$;
rollback;
