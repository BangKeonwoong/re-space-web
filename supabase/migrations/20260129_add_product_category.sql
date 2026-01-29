alter table public.products
  add column if not exists category text not null default 'new';

update public.products
set category = 'new'
where category is null;
