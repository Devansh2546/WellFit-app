-- ============================================
-- WellFit Database Schema
-- Run this FIRST, before any insert_*.sql files
-- ============================================

-- ---------- Content tables ----------
create table if not exists categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  image_url text
);

create table if not exists workouts (
  id serial primary key,
  category_id int references categories(id),
  title text not null,
  slug text unique not null,
  description text,
  instructions text[],
  video_url text,
  requires_login boolean default true
);

create table if not exists articles (
  id serial primary key,
  slug text unique not null,
  title text not null,
  cover_image text,
  body text not null,
  requires_login boolean default true,
  published_at timestamp default now()
);

create table if not exists recipes (
  id serial primary key,
  slug text unique not null,
  title text not null,
  description text,
  cover_image text,
  prep_time_minutes int,
  total_time_minutes int,
  servings int,
  tags text[],
  ingredients text[],
  steps jsonb,
  requires_login boolean default true
);

create table if not exists recipe_nutrients (
  recipe_id int references recipes(id) primary key,
  calories numeric,
  fat_g numeric,
  carbs_g numeric,
  protein_g numeric
);

-- ---------- Auth-linked profile table ----------
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  age int,
  gender text,
  dob date,
  weight numeric,
  height numeric
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Chatbot rate-limiting table ----------
create table if not exists chat_usage (
  user_id uuid references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  message_count int not null default 0,
  primary key (user_id, usage_date)
);

-- ============================================
-- Row Level Security
-- ============================================

-- Content tables: public rows visible to everyone, gated rows only to logged-in users
alter table categories enable row level security;
alter table workouts enable row level security;
alter table articles enable row level security;
alter table recipes enable row level security;
alter table recipe_nutrients enable row level security;

drop policy if exists "categories are public" on categories;
create policy "categories are public"
on categories for select
using (true);

drop policy if exists "workouts visibility" on workouts;
create policy "workouts visibility"
on workouts for select
using (requires_login = false or auth.role() = 'authenticated');

drop policy if exists "articles visibility" on articles;
create policy "articles visibility"
on articles for select
using (requires_login = false or auth.role() = 'authenticated');

drop policy if exists "recipes visibility" on recipes;
create policy "recipes visibility"
on recipes for select
using (requires_login = false or auth.role() = 'authenticated');

drop policy if exists "recipe_nutrients visibility" on recipe_nutrients;
create policy "recipe_nutrients visibility"
on recipe_nutrients for select
using (
  exists (
    select 1 from recipes r
    where r.id = recipe_nutrients.recipe_id
    and (r.requires_login = false or auth.role() = 'authenticated')
  )
);

-- Profiles: users can only see/edit their own row
alter table profiles enable row level security;

drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile"
on profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Chat usage: users can view their own usage; only the Edge Function
-- (via service role, which bypasses RLS) may write to this table
alter table chat_usage enable row level security;

drop policy if exists "Users can view their own usage" on chat_usage;
create policy "Users can view their own usage"
on chat_usage for select
using (auth.uid() = user_id);
