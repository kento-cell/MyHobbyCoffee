create extension if not exists "pgcrypto";

-- 1) 生豆在庫: bean_stock
create table if not exists public.bean_stock (
  id uuid primary key default gen_random_uuid(),
  bean_name text not null,
  green_stock_gram integer not null,
  updated_at timestamp with time zone not null default now()
);

-- 2) 注文: orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null,
  product_id text not null,
  product_name text not null,
  roast_level text not null,
  gram integer not null,
  price integer not null,
  customer_email text not null,
  created_at timestamp with time zone not null default now()
);

-- 3) 焙煎日: roast_profile
create table if not exists public.roast_profile (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  roast_date date not null,
  best_from date not null,
  best_until date not null,
  created_at timestamp with time zone not null default now()
);
