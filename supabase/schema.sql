create extension if not exists "pgcrypto";

-- bean_stocks
create table if not exists public.bean_stocks (
  id uuid primary key default gen_random_uuid(),
  bean_name text not null,
  current_stock_g integer not null default 0,
  loss_rate double precision not null default 0.12,
  updated_at timestamp with time zone not null default now()
);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  base_bean_name text not null,
  roast_level text,
  base_price integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  total_amount integer not null,
  created_at timestamp with time zone not null default now()
);

-- order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  gram_amount integer not null,
  roast_level text,
  subtotal integer not null,
  created_at timestamp with time zone not null default now()
);

-- freshness_rules
create table if not exists public.freshness_rules (
  id uuid primary key default gen_random_uuid(),
  roast_level text not null,
  drink_after_days integer not null,
  drink_end_days integer not null
);
