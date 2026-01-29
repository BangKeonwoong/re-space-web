create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_krw integer not null check (price_krw >= 0),
  category text not null default 'new',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  quantity integer not null default 1 check (quantity > 0),
  message text,
  status text not null default 'new',
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  product_id uuid references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_krw integer not null check (unit_price_krw >= 0),
  total_price_krw integer not null check (total_price_krw >= 0),
  currency text not null default 'KRW',
  status text not null default 'pending',
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  user_id uuid references auth.users(id),
  guest_token uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  amount integer not null check (amount >= 0),
  currency text not null default 'KRW',
  status text not null default 'created',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger set_quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger set_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.admin_users enable row level security;

create policy "products are viewable" on public.products
  for select using (true);

create policy "quotes view own" on public.quotes
  for select using (auth.uid() = user_id);

create policy "orders view own" on public.orders
  for select using (auth.uid() = user_id);

create policy "payments view via order" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id and o.user_id = auth.uid()
    )
  );

create policy "admins view own" on public.admin_users
  for select using (auth.uid() = user_id);
