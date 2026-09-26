insert into recipes (slug, title, description, cover_image, prep_time_minutes, total_time_minutes, servings, tags, ingredients, steps, requires_login) values
(
  'grilled-chicken-quinoa-bowl',
  'Grilled Chicken & Quinoa Bowl',
  'A balanced high-protein bowl with grilled chicken, fluffy quinoa, and crisp vegetables in a light lemon dressing.',
  'grilled-chicken-quinoa-bowl.jpg',
  15, 30, 2,
  array['High Protein','Gluten Free','Dairy Free','Meal Prep Friendly'],
  array['2 boneless chicken breasts','1 cup quinoa (dry)','2 cups vegetable or chicken broth','1 cup cherry tomatoes, halved','1 cucumber, diced','1/4 red onion, thinly sliced','2 tbsp olive oil','1 lemon, juiced','Salt and pepper, to taste','1/4 cup crumbled feta (optional)'],
  '[{"title": "Cook the quinoa", "description": "Rinse quinoa, then simmer in broth for 15 minutes until the liquid is absorbed. Fluff with a fork."}, {"title": "Grill the chicken", "description": "Season chicken with salt, pepper, and a little olive oil. Grill or pan-sear 6-7 minutes per side until the internal temperature reaches 165\u00b0F (74\u00b0C). Rest 5 minutes, then slice."}, {"title": "Assemble", "description": "Divide quinoa between bowls, top with sliced chicken, tomatoes, cucumber, and red onion. Drizzle with olive oil and lemon juice, and finish with feta if using."}]'::jsonb,
  true
),
(
  'peanut-butter-banana-overnight-oats',
  'Peanut Butter Banana Overnight Oats',
  'A make-ahead breakfast combining rolled oats, ripe banana, and peanut butter for a filling, naturally sweetened start to the day.',
  'peanut-butter-banana-overnight-oats.jpg',
  10, 490, 2,
  array['Vegetarian','No Cook','Meal Prep Friendly','High Fiber'],
  array['1 cup rolled oats','1 cup milk (dairy or plant-based)','1/2 cup plain yogurt','2 tbsp peanut butter','1 ripe banana, mashed','1 tbsp chia seeds','1 tsp honey or maple syrup','Pinch of cinnamon'],
  '[{"title": "Mix the base", "description": "In a jar or bowl, combine oats, milk, yogurt, chia seeds, and cinnamon."}, {"title": "Add banana and peanut butter", "description": "Stir in the mashed banana, peanut butter, and honey until evenly combined."}, {"title": "Chill overnight", "description": "Cover and refrigerate at least 6 hours, or overnight. Stir before serving; top with extra banana or a drizzle of peanut butter if desired."}]'::jsonb,
  true
),
(
  'baked-salmon-roasted-vegetables',
  'Baked Salmon with Roasted Vegetables',
  'A simple one-pan dinner pairing flaky baked salmon with caramelized seasonal vegetables.',
  'baked-salmon-roasted-vegetables.jpg',
  10, 35, 2,
  array['High Protein','Gluten Free','Dairy Free','Omega-3 Rich'],
  array['2 salmon fillets (about 150g each)','2 cups mixed vegetables (broccoli, bell pepper, zucchini)','2 tbsp olive oil','2 cloves garlic, minced','1 lemon (half sliced, half juiced)','Salt and pepper, to taste','1 tsp dried oregano'],
  '[{"title": "Prep the pan", "description": "Preheat oven to 400\u00b0F (200\u00b0C). Toss vegetables with 1 tbsp olive oil, garlic, salt, and pepper on a sheet pan."}, {"title": "Add the salmon", "description": "Nestle salmon fillets among the vegetables. Drizzle with remaining oil and lemon juice, season with oregano, salt, and pepper, and top each fillet with a lemon slice."}, {"title": "Roast", "description": "Bake 18-20 minutes, until the salmon flakes easily with a fork and the vegetables are tender."}]'::jsonb,
  true
),
(
  'greek-yogurt-berry-parfait',
  'Greek Yogurt Berry Parfait',
  'Layers of thick Greek yogurt, mixed berries, and crunchy granola make a quick high-protein snack or breakfast.',
  'greek-yogurt-berry-parfait.jpg',
  10, 10, 1,
  array['Vegetarian','High Protein','No Cook','Quick'],
  array['1 cup plain Greek yogurt','1/2 cup mixed berries (strawberries, blueberries, raspberries)','1/4 cup granola','1 tsp honey'],
  '[{"title": "Layer the base", "description": "Spoon half the yogurt into a glass or jar."}, {"title": "Add berries and granola", "description": "Add a layer of berries, then a layer of granola. Repeat with the remaining yogurt, berries, and granola."}, {"title": "Finish", "description": "Drizzle with honey just before serving."}]'::jsonb,
  false
);

insert into recipe_nutrients (recipe_id, calories, fat_g, carbs_g, protein_g) values
(
  (select id from recipes where slug = 'grilled-chicken-quinoa-bowl'),
  430, 14, 34, 38
),
(
  (select id from recipes where slug = 'peanut-butter-banana-overnight-oats'),
  380, 14, 48, 15
),
(
  (select id from recipes where slug = 'baked-salmon-roasted-vegetables'),
  410, 24, 16, 34
),
(
  (select id from recipes where slug = 'greek-yogurt-berry-parfait'),
  290, 8, 34, 22
);