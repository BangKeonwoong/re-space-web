do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'orders' and policyname = 'orders view by admin'
  ) then
    create policy "orders view by admin" on public.orders
      for select using (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quotes' and policyname = 'quotes view by admin'
  ) then
    create policy "quotes view by admin" on public.quotes
      for select using (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quotes' and policyname = 'quotes update by admin'
  ) then
    create policy "quotes update by admin" on public.quotes
      for update using (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      ) with check (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'payments' and policyname = 'payments view by admin'
  ) then
    create policy "payments view by admin" on public.payments
      for select using (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'order_items' and policyname = 'order items view by admin'
  ) then
    create policy "order items view by admin" on public.order_items
      for select using (
        exists (
          select 1 from public.admin_users a
          where a.user_id = auth.uid()
        )
      );
  end if;
end $$;
