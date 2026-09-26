insert into recipes (slug, title, description, cover_image, prep_time_minutes, total_time_minutes, servings, tags, ingredients, steps, requires_login) values
(
  'cranberry-cheesecake-overnight-oats',
  'Cranberry Cheesecake Overnight Oats',
  'A fiber-rich make-ahead breakfast that layers tangy cranberry sauce with creamy cheesecake-style oats.',
  'https://www.eatingwell.com/thmb/Mx-KOld5eFs_dTlHITBCeypKxyc=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Cranberry-cheesecake-overnight-oats-Beauty-118371_preview_maxWidth_4000_maxHeight_4000_ppi_300_quality_100-395eba5cd181480d99d9a66e4b061cd7.jpg',
  45, 745, 4,
  array['Sesame-Free','Weight Loss','Nut Free','Soy Free','High Fiber','Vegetarian','High Protein','Egg Free'],
  array['2¼ cups whole milk','2 cups old-fashioned rolled oats','½ cup whole-milk plain yogurt','4 teaspoons vanilla extract, divided','1 tablespoon chia seeds','½ teaspoon ground cinnamon','¼ teaspoon salt','2 cups frozen whole cranberries','1 teaspoon grated orange zest','⅓ cup orange juice','1½ tablespoons sugar','⅛ teaspoon ground ginger','¾ cup reduced-fat cream cheese (6 oz), softened','1½ tablespoons half-and-half','1 teaspoon honey','½ cup graham cracker crumbs'],
  '[{"title": "Soak the oats", "description": "Combine milk, oats, yogurt, 2 tsp vanilla, chia seeds, cinnamon and salt; stir well. Cover and refrigerate at least 12 hours (up to 4 days)."}, {"title": "Make cranberry sauce", "description": "Combine cranberries, orange zest, orange juice, sugar and ginger in a saucepan; bring to a boil, then simmer, stirring occasionally, until berries burst and mixture thickens, about 10 minutes. Cool, then refrigerate."}, {"title": "Make cheesecake filling", "description": "Stir cream cheese, half-and-half, honey and remaining vanilla until fully combined. Refrigerate."}, {"title": "Layer and serve", "description": "Spoon cranberry sauce into jars, top with oat mixture, then cheesecake filling. Repeat layers and top with graham cracker crumbs."}]'::jsonb,
  true
),
(
  'veggie-wraps',
  'Veggie Wraps',
  'A quick skillet-veggie wrap with hummus and feta -- ready in 15 minutes.',
  'https://www.eatingwell.com/thmb/SFzF0xAb7EfpPj1VM0JoVTEcnHA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/EW-Veggie-Wrap-hero-1x1-15189_preview_maxWidth_4000_maxHeight_4000_ppi_300_quality_100-4e96432654934ca0a769a29756b122d4.jpg',
  15, 15, 2,
  array['Gut Healthy','Weight Loss','Nut Free','Soy Free','High Fiber','Vegetarian','High Protein','Egg Free'],
  array['1 teaspoon extra-virgin olive oil','½ small zucchini, sliced','½ medium red bell pepper, sliced','¼ small red onion, sliced','½ teaspoon dried oregano','Pinch of salt','2 whole-grain wraps','¼ cup hummus','½ cup baby spinach','2 tablespoons crumbled feta cheese','4 black olives, sliced'],
  '[{"title": "Cook the vegetables", "description": "Heat oil in a skillet over medium-low heat. Add zucchini, bell pepper, onion, oregano and salt; cook, stirring, until soft, 5-7 minutes."}, {"title": "Assemble", "description": "Lay out wraps, spread hummus, add spinach and the sauteed vegetables. Sprinkle with feta and olives. Roll up and cut in half."}]'::jsonb,
  true
),
(
  'crunchy-chopped-salad',
  'Crunchy Chopped Salad',
  'A chickpea-cabbage salad with carrots and cucumber, tossed in a ginger-miso dressing.',
  'https://www.eatingwell.com/thmb/sPxyP3wMBT_DdgFplmoGM2zpKbw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cccc-chopped-salad-step-01-520_preview_maxWidth_4000_maxHeight_4000_ppi_300_quality_100-d44c94bbd30a4072be14059160cf3a70.jpg',
  20, 20, 6,
  array['Sesame-Free','Weight Loss','Nut Free','Soy Free','Dairy Free','High Fiber','Vegan','Vegetarian','Pregnancy Safe'],
  array['3 tablespoons extra-virgin olive oil','1 tablespoon cider vinegar','1 tablespoon reduced-sodium soy sauce','1 tablespoon white miso','2 teaspoons grated lime zest','1 teaspoon minced garlic','1 teaspoon grated fresh ginger','½ teaspoon ground pepper','¼ teaspoon salt','2 cups finely chopped green cabbage','1 (15-oz) can no-salt-added chickpeas, rinsed','1 cup finely chopped cucumber','1 cup finely chopped carrots','½ cup minced red onion','¼ cup chopped fresh cilantro'],
  '[{"title": "Make the dressing", "description": "Whisk oil, vinegar, soy sauce, miso, lime zest, garlic, ginger, pepper and salt in a large bowl until combined."}, {"title": "Toss and serve", "description": "Add cabbage, chickpeas, cucumber, carrots, onion and cilantro; toss until evenly coated. Serve immediately or refrigerate up to 5 days."}]'::jsonb,
  true
),
(
  'three-bean-salad',
  'Three Bean Salad',
  'A colorful, fiber- and protein-rich bean salad that works as a side, appetizer, or packed lunch.',
  'https://www.eatingwell.com/thmb/ddE7wZXMDdTOzRpeScOg4U_mdPI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/EW-Three-Bean-Salad-hero-1x1-14992_preview_maxWidth_4000_maxHeight_4000_ppi_300_quality_100-7c15aaa1f1814709b514a6136dae8b94.jpg',
  25, 25, 8,
  array['Sesame-Free','Weight Loss','Nut Free','Soy Free','High Fiber','Vegan','Vegetarian','Gluten Free','Heart Healthy'],
  array['1½ pounds green beans, trimmed and cut into 1-inch pieces','¼ cup extra-virgin olive oil','¼ cup white-wine vinegar','2 tablespoons lemon juice','2 cloves garlic, chopped','¼ teaspoon salt','¼ teaspoon ground pepper','⅔ cup canned great northern beans, rinsed','⅔ cup canned pinto beans, rinsed','1 large red bell pepper, chopped','1 large carrot, peeled and chopped','1 tablespoon chopped fresh parsley'],
  '[{"title": "Blanch the green beans", "description": "Boil green beans for 3 minutes, then transfer to an ice bath and drain."}, {"title": "Make the dressing", "description": "Whisk oil, vinegar, lemon juice, garlic, salt and pepper in a large bowl."}, {"title": "Toss together", "description": "Add white beans, pinto beans, bell pepper, carrot, parsley and the blanched green beans; toss to coat."}]'::jsonb,
  true
);

insert into recipe_nutrients (recipe_id, calories, fat_g, carbs_g, protein_g) values
(
  (select id from recipes where slug = 'cranberry-cheesecake-overnight-oats'),
  520, 22, 64, 17
),
(
  (select id from recipes where slug = 'veggie-wraps'),
  361, 14, 50, 12
),
(
  (select id from recipes where slug = 'crunchy-chopped-salad'),
  162, 8, 19, 5
),
(
  (select id from recipes where slug = 'three-bean-salad'),
  132, 7, 15, 4
);