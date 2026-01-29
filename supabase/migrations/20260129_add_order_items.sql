create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_krw integer not null check (unit_price_krw >= 0),
  total_price_krw integer not null check (total_price_krw >= 0),
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "order items view via orders" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
