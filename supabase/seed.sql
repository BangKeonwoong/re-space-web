-- Seed data for multi-product setup (idempotent inserts)
update public.products
set category = 'new'
where category is null;

insert into public.products (name, description, price_krw, is_active, category)
select
  'Re:Space Core Product',
  'Single product used for initial launch. Update name/description/price as needed.',
  100000,
  true,
  'new'
where not exists (select 1 from public.products where name = 'Re:Space Core Product');

insert into public.products (name, description, price_krw, is_active, category)
select
  'Aeron Remastered (S-Grade)',
  'Premium refurbished chair in near-new condition.',
  980000,
  true,
  'premium-refurb'
where not exists (select 1 from public.products where name = 'Aeron Remastered (S-Grade)');

insert into public.products (name, description, price_krw, is_active, category)
select
  'Eames Molded (Refurb)',
  'Refurbished chair with verified parts.',
  420000,
  true,
  'refurb'
where not exists (select 1 from public.products where name = 'Eames Molded (Refurb)');

insert into public.products (name, description, price_krw, is_active, category)
select
  'Eames Lounge (Vintage)',
  'Vintage piece with professional restoration.',
  2800000,
  true,
  'vintage'
where not exists (select 1 from public.products where name = 'Eames Lounge (Vintage)');

insert into public.products (name, description, price_krw, is_active, category)
select
  'Nelson Bench (New)',
  'New arrival with limited stock.',
  680000,
  true,
  'new'
where not exists (select 1 from public.products where name = 'Nelson Bench (New)');
