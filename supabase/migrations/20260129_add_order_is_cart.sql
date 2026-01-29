alter table public.orders
  add column if not exists is_cart boolean not null default false;
