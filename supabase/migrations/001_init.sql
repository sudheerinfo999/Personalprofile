-- Portfolio Hub schema + RLS (run in Supabase SQL editor or via migrations)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  role text not null check (role in ('admin', 'employee')) default 'employee',
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text not null,
  thumbnail_path text,
  category text,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolios_active_idx on public.portfolios(is_active);
create index if not exists portfolios_category_idx on public.portfolios(category);
create index if not exists portfolios_tags_gin on public.portfolios using gin(tags);

create table if not exists public.portfolio_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, portfolio_id)
);

create index if not exists portfolio_access_user_idx on public.portfolio_access(user_id);
create index if not exists portfolio_access_portfolio_idx on public.portfolio_access(portfolio_id);

-- Role helper for RLS
create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_access enable row level security;

-- Profiles: read/update own profile
drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Portfolios:
-- Admin can do everything (RLS still applies via current_role())
drop policy if exists portfolios_admin_all on public.portfolios;
create policy portfolios_admin_all
on public.portfolios for all
to authenticated
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

-- Employees can read active portfolios (simple model)
drop policy if exists portfolios_employee_read_active on public.portfolios;
create policy portfolios_employee_read_active
on public.portfolios for select
to authenticated
using (
  public.current_role() = 'employee'
  and is_active = true
);

-- Access mappings: admin manages; employees can read their own mappings
drop policy if exists access_admin_all on public.portfolio_access;
create policy access_admin_all
on public.portfolio_access for all
to authenticated
using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

drop policy if exists access_employee_read_own on public.portfolio_access;
create policy access_employee_read_own
on public.portfolio_access for select
to authenticated
using (user_id = auth.uid());

