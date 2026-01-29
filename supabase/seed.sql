-- Seed data for multi-product setup (idempotent inserts)
update public.products
set category = 'new'
where category is null;

update public.products
set image_url = '/products/placeholder.svg'
where image_url is null;

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Re:Space Core Product',
  'Single product used for initial launch. Update name/description/price as needed.',
  100000,
  true,
  'new',
  '/products/modern-desk.svg'
where not exists (select 1 from public.products where name = 'Re:Space Core Product');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Aeron Remastered (S-Grade)',
  'Premium refurbished chair in near-new condition.',
  980000,
  true,
  'premium-refurb',
  '/products/aeron.svg'
where not exists (select 1 from public.products where name = 'Aeron Remastered (S-Grade)');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Eames Molded (Refurb)',
  'Refurbished chair with verified parts.',
  420000,
  true,
  'refurb',
  '/products/eames-molded.svg'
where not exists (select 1 from public.products where name = 'Eames Molded (Refurb)');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Eames Lounge (Vintage)',
  'Vintage piece with professional restoration.',
  2800000,
  true,
  'vintage',
  '/products/eames-lounge.svg'
where not exists (select 1 from public.products where name = 'Eames Lounge (Vintage)');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Nelson Bench (New)',
  'New arrival with limited stock.',
  680000,
  true,
  'new',
  '/products/nelson-bench.svg'
where not exists (select 1 from public.products where name = 'Nelson Bench (New)');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Knoll Modular Sofa',
  'Premium refurbished modular sofa with fresh upholstery.',
  1850000,
  true,
  'premium-refurb',
  '/products/knoll-sofa.svg'
where not exists (select 1 from public.products where name = 'Knoll Modular Sofa');

insert into public.products (name, description, price_krw, is_active, category, image_url)
select
  'Modern Desk (Oak)',
  'Minimal workstation desk with solid oak top.',
  520000,
  true,
  'new',
  '/products/modern-desk.svg'
where not exists (select 1 from public.products where name = 'Modern Desk (Oak)');
