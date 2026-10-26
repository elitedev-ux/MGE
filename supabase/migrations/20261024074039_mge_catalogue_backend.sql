-- Public catalogue; every write goes through the password-protected Edge Function.
create schema if not exists mge_private;
revoke all on schema mge_private from public, anon, authenticated;
grant usage on schema mge_private to service_role;
create extension if not exists pgcrypto with schema extensions;

create table public.products (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{0,119}$'),
  name text not null check (length(btrim(name)) between 1 and 300),
  brand text not null check (length(btrim(brand)) between 1 and 300),
  category text not null check (category in ('Laptops','Audio','Charging','Wearables','Gaming','Lighting','Office','Accessories')),
  price numeric(14,2) not null check (price between 0 and 10000000000),
  price_is_placeholder boolean not null default false,
  original numeric(14,2) check (original > price and original <= 10000000000),
  image text not null,
  images text[] not null check (cardinality(images) between 1 and 4 and image = images[1]),
  badge text check (length(badge) <= 80),
  specs jsonb not null default '{}' check (jsonb_typeof(specs) = 'object'),
  description text not null check (length(btrim(description)) between 1 and 10000),
  stock integer check (stock between 0 and 1000000),
  identification text not null default 'owner-supplied',
  details_note text not null default '' check (length(details_note) <= 5000),
  sources jsonb not null default '[]' check (jsonb_typeof(sources) = 'array'),
  sort_order bigint generated always as identity,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create index products_sort_order_idx on public.products(sort_order);
alter table public.products enable row level security;
revoke all on public.products from public, anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.products to service_role;
grant usage on sequence public.products_sort_order_seq to service_role;
create policy "Public catalogue read" on public.products for select to anon, authenticated using (true);

create function mge_private.product_revision() returns trigger language plpgsql set search_path = '' as $$
begin
  new.id := old.id;
  new.sort_order := old.sort_order;
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;
create trigger product_revision before update on public.products for each row execute function mge_private.product_revision();

create table mge_private.admin_credentials (
  singleton boolean primary key default true check (singleton),
  password_hash text not null,
  changed_at timestamptz not null default now()
);
create table mge_private.admin_sessions (
  token_hash text primary key,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table mge_private.login_attempts (
  id bigint generated always as identity primary key,
  client_hash text not null,
  attempted_at timestamptz not null default now()
);
create index login_attempts_time_idx on mge_private.login_attempts(attempted_at);
create index login_attempts_client_time_idx on mge_private.login_attempts(client_hash, attempted_at);
alter table mge_private.admin_credentials enable row level security;
alter table mge_private.admin_sessions enable row level security;
alter table mge_private.login_attempts enable row level security;
revoke all on all tables in schema mge_private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema mge_private to service_role;
grant usage on all sequences in schema mge_private to service_role;

-- These RPCs are service-role-only; the browser cannot call them directly.
create function public.mge_admin_login(p_password text, p_client_hash text) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare stored text; token text; deadline timestamptz;
begin
  perform pg_advisory_xact_lock(721849620);
  delete from mge_private.login_attempts where attempted_at < now() - interval '15 minutes';
  delete from mge_private.admin_sessions where expires_at <= now();
  if (select count(*) from mge_private.login_attempts where client_hash = p_client_hash) >= 5
     or (select count(*) from mge_private.login_attempts) >= 30 then
    return jsonb_build_object('error','Too many attempts. Please try again in 15 minutes.','status',429);
  end if;
  select password_hash into stored from mge_private.admin_credentials where singleton;
  if stored is null or p_password is null or length(p_password) > 128 or extensions.crypt(p_password, stored) <> stored then
    insert into mge_private.login_attempts(client_hash) values (left(coalesce(p_client_hash,'unknown'),128));
    return jsonb_build_object('error','Incorrect password.','status',401);
  end if;
  delete from mge_private.login_attempts where client_hash = p_client_hash;
  token := encode(extensions.gen_random_bytes(32),'hex');
  deadline := now() + interval '8 hours';
  insert into mge_private.admin_sessions(token_hash, expires_at) values (encode(extensions.digest(token,'sha256'),'hex'), deadline);
  return jsonb_build_object('token',token,'expiresAt',deadline);
end;
$$;

create function public.mge_admin_authorize(p_token text) returns boolean
language sql security invoker set search_path = '' as $$
  select exists(select 1 from mge_private.admin_sessions
    where token_hash = encode(extensions.digest(p_token,'sha256'),'hex') and expires_at > now());
$$;
create function public.mge_admin_logout(p_token text) returns void
language sql security invoker set search_path = '' as $$
  delete from mge_private.admin_sessions where token_hash = encode(extensions.digest(p_token,'sha256'),'hex');
$$;
revoke all on function public.mge_admin_login(text,text), public.mge_admin_authorize(text), public.mge_admin_logout(text) from public, anon, authenticated;
grant execute on function public.mge_admin_login(text,text), public.mge_admin_authorize(text), public.mge_admin_logout(text) to service_role;
revoke all on function mge_private.product_revision() from public, anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,3145728,array['image/png','image/jpeg','image/webp']);
-- No client write policies: uploads go through the authenticated Edge Function.
