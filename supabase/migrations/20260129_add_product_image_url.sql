alter table public.products
  add column if not exists image_url text;

update public.products
set image_url = '/products/placeholder.svg'
where image_url is null;
