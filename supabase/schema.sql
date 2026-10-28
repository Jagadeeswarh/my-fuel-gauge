create extension if not exists pgcrypto;
create table if not exists public.fuel_entries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 filled_at timestamptz not null,
 odometer_km integer check(odometer_km is null or odometer_km>0),
 litres numeric(10,2) not null check(litres>0),
 price_per_litre numeric(10,2) not null check(price_per_litre>0),
 amount numeric(12,2) not null check(amount>0),
 station text, receipt_number text, density_kg_m3 numeric(8,2),
 range_km integer check(range_km is null or range_km>=0),
 notes text, source text default 'manual',
 fingerprint text generated always as (md5(coalesce(receipt_number,'') || '|' || filled_at::date::text || '|' || litres::text || '|' || amount::text || '|' || coalesce(odometer_km::text,''))) stored,
 created_at timestamptz not null default now()
);
create index if not exists fuel_entries_user_date_idx on public.fuel_entries(user_id,filled_at desc);
create unique index if not exists fuel_entries_user_fingerprint_idx on public.fuel_entries(user_id,fingerprint);
alter table public.fuel_entries enable row level security;
drop policy if exists "Owners can read own fuel entries" on public.fuel_entries;
create policy "Owners can read own fuel entries" on public.fuel_entries for select to authenticated using(auth.uid()=user_id);
drop policy if exists "Owners can insert own fuel entries" on public.fuel_entries;
create policy "Owners can insert own fuel entries" on public.fuel_entries for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "Owners can update own fuel entries" on public.fuel_entries;
create policy "Owners can update own fuel entries" on public.fuel_entries for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "Owners can delete own fuel entries" on public.fuel_entries;
create policy "Owners can delete own fuel entries" on public.fuel_entries for delete to authenticated using(auth.uid()=user_id);
-- Keep Storage private. If using evidence uploads, create a private 'fuel-evidence' bucket and owner-scoped Storage policies.