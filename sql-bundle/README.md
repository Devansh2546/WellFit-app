# WellFit SQL Bundle

Run these files in Supabase SQL Editor, in this exact order (the numbering
tells you the order):

1. **00_schema.sql** — creates every table, sets up the auto-profile trigger,
   and enables all Row Level Security policies. Safe to re-run any time
   (uses `if not exists` / `drop ... if exists` throughout).
2. **01_insert_workouts.sql** — 55 real exercises across all categories.
   ⚠️ Requires the `categories` table to already have rows in it first
   (see note below).
3. **02_insert_articles.sql** — 5 articles (creatine, gym injury tips,
   protein shakes, sweating, changing your routine).
4. **03_insert_recipes.sql** — 4 original recipes (cranberry oats, veggie
   wraps, chopped salad, three bean salad) + their nutrition data.
5. **04_insert_more_recipes.sql** — 4 additional original recipes (chicken
   quinoa bowl, PB banana oats, baked salmon, Greek yogurt parfait).
6. **05_insert_more_articles.sql** — 4 additional original articles
   (hydration, progressive overload, sleep, warm-up vs stretching).

## Before running 01_insert_workouts.sql

You need your 12 categories inserted first, since workouts reference them
by slug. Run this once, before file 01:

```sql
insert into categories (slug, name, image_url) values
  ('chest', 'Chest', 'chest.jpg'),
  ('back', 'Back', 'back.jpg'),
  ('shoulders', 'Shoulders', 'shoulders.jpg'),
  ('biceps', 'Biceps', 'biceps.jpg'),
  ('triceps', 'Triceps', 'triceps.jpg'),
  ('legs', 'Legs', 'legs.jpg'),
  ('abs', 'Abs', 'abs.jpg'),
  ('forearms', 'Forearms', 'forearms.jpg'),
  ('cardio', 'Cardio', 'cardio.jpg'),
  ('boxing', 'Boxing', 'boxing.jpg'),
  ('yoga', 'Yoga', 'yoga.jpg'),
  ('strength-training', 'Strength Training', 'strength-training.jpg');
```

(Adjust image extensions to match whatever files you actually saved in
`public/images/categories/`.)

## After everything's inserted

Point video/image URLs at your actual hosted files:

```sql
-- workout videos (after uploading to Supabase Storage)
update workouts
set video_url = 'https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/workout-videos/' || slug || '.mp4';

-- category images (if using the self-hosted /public/images/categories/ pattern)
update categories set image_url = slug || '.jpg';
```

## Not included here

This bundle only contains the SQL we generated together — it does **not**
include the Supabase Edge Function code (`chatbot/index.ts`) or any React
component files. Those live in your actual project folder already.
