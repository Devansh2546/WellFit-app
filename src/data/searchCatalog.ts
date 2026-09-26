import { supabase } from '../lib/supabase'

export interface SuggestionItem {
  id: string
  title: string
  subtitle: string
  type: 'exercise' | 'tool' | 'recipe' | 'article' | 'category'
  url: string
  keywords?: string[]
}

// Comprehensive WellFit Athletic Catalog for instant, zero-latency autocomplete
export const STATIC_SEARCH_CATALOG: SuggestionItem[] = [
  // --- Core Athletic Exercises & Workouts ---
  {
    id: 'ex-bench-press',
    title: 'Bench Press',
    subtitle: 'Compound Chest Exercise · Barbell & Dumbbell',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['bench', 'chest', 'press', 'barbell', 'pecs', 'push', 'upper body', 'strength']
  },
  {
    id: 'ex-incline-bench-press',
    title: 'Incline Dumbbell Bench Press',
    subtitle: 'Upper Chest Focus · Dumbbell Exercise',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['incline', 'bench', 'press', 'upper chest', 'dumbbell', 'pecs']
  },
  {
    id: 'ex-decline-bench-press',
    title: 'Decline Dumbbell Press',
    subtitle: 'Lower Chest Definition · Bench Exercise',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['decline', 'bench', 'press', 'lower chest', 'pecs']
  },
  {
    id: 'ex-bent-over-rows',
    title: 'Bent-Over Rows',
    subtitle: 'Compound Back & Lats Exercise · Free Weights',
    type: 'exercise',
    url: '/workouts/back',
    keywords: ['bent', 'row', 'back', 'lats', 'dumbbell', 'barbell', 'pull']
  },
  {
    id: 'ex-bench-dips',
    title: 'Bench Dips',
    subtitle: 'Triceps & Upper Arm Bodyweight Exercise',
    type: 'exercise',
    url: '/workouts/arms',
    keywords: ['bench', 'dips', 'triceps', 'arms', 'bodyweight']
  },
  {
    id: 'ex-chest-flyes',
    title: 'Chest Flyes',
    subtitle: 'Chest Definition & Peak Contraction',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['chest', 'flyes', 'pecs', 'dumbbell', 'isolation']
  },
  {
    id: 'ex-push-ups',
    title: 'Push-Ups',
    subtitle: 'Calisthenics Upper Body Compound',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['push', 'ups', 'calisthenics', 'chest', 'triceps', 'core']
  },
  {
    id: 'ex-pec-dec-flyes',
    title: 'Pec Dec Flyes',
    subtitle: 'Machine Isolation for Chest Muscles',
    type: 'exercise',
    url: '/workouts/chest',
    keywords: ['pec', 'dec', 'flyes', 'machine', 'chest']
  },
  {
    id: 'ex-deadlifts',
    title: 'Deadlifts',
    subtitle: 'Full-Body Posterior Chain Powerhouse',
    type: 'exercise',
    url: '/workouts/back',
    keywords: ['deadlift', 'deadlifts', 'back', 'hamstrings', 'glutes', 'strength']
  },
  {
    id: 'ex-lat-pulldowns',
    title: 'Lat Pulldowns',
    subtitle: 'Back Width & Upper Lat Hypertrophy',
    type: 'exercise',
    url: '/workouts/back',
    keywords: ['lat', 'pulldowns', 'back', 'lats', 'cable']
  },
  {
    id: 'ex-pull-ups',
    title: 'Pull Ups',
    subtitle: 'Vertical Pulling Strength & Back Width',
    type: 'exercise',
    url: '/workouts/back',
    keywords: ['pull', 'ups', 'lats', 'back', 'bodyweight']
  },
  {
    id: 'ex-barbell-shrugs',
    title: 'Barbell Shrugs',
    subtitle: 'Trapezius Muscle Development',
    type: 'exercise',
    url: '/workouts/back',
    keywords: ['shrugs', 'barbell', 'traps', 'back', 'neck']
  },
  {
    id: 'ex-shoulder-press',
    title: 'Shoulder Press',
    subtitle: 'Deltoid Compound Overhead Press',
    type: 'exercise',
    url: '/workouts/shoulders',
    keywords: ['shoulder', 'press', 'deltoids', 'overhead', 'military']
  },
  {
    id: 'ex-lateral-raises',
    title: 'Lateral Raises',
    subtitle: 'Side Deltoid Isolation for Width',
    type: 'exercise',
    url: '/workouts/shoulders',
    keywords: ['lateral', 'raises', 'shoulders', 'delts', 'side delts']
  },
  {
    id: 'ex-front-raises',
    title: 'Front Raises',
    subtitle: 'Anterior Deltoid Isolation',
    type: 'exercise',
    url: '/workouts/shoulders',
    keywords: ['front', 'raises', 'shoulders', 'delts']
  },
  {
    id: 'ex-face-pull',
    title: 'Face Pull',
    subtitle: 'Rear Delts & Shoulder Rotator Health',
    type: 'exercise',
    url: '/workouts/shoulders',
    keywords: ['face', 'pull', 'rear delts', 'posture', 'cable']
  },
  {
    id: 'ex-squats',
    title: 'Squats',
    subtitle: 'Quadriceps, Hamstrings & Glutes Builder',
    type: 'exercise',
    url: '/workouts/legs',
    keywords: ['squat', 'squats', 'legs', 'quads', 'glutes', 'compound']
  },
  {
    id: 'ex-leg-press',
    title: 'Leg Press',
    subtitle: 'Heavy Lower Body Hypertrophy Machine',
    type: 'exercise',
    url: '/workouts/legs',
    keywords: ['leg', 'press', 'quads', 'legs', 'machine']
  },
  {
    id: 'ex-leg-curls',
    title: 'Leg Curls',
    subtitle: 'Hamstring Knee Flexion Isolation',
    type: 'exercise',
    url: '/workouts/legs',
    keywords: ['leg', 'curls', 'hamstrings', 'legs', 'machine']
  },
  {
    id: 'ex-bulgarian-split-squat',
    title: 'Bulgarian Split Squat',
    subtitle: 'Unilateral Quads & Glute Strength',
    type: 'exercise',
    url: '/workouts/legs',
    keywords: ['bulgarian', 'split', 'squat', 'legs', 'glutes', 'bench']
  },
  {
    id: 'ex-bicep-curls',
    title: 'Bicep Curls',
    subtitle: 'Arm Flexor & Bicep Peak Hypertrophy',
    type: 'exercise',
    url: '/workouts/arms',
    keywords: ['bicep', 'curls', 'arms', 'dumbbell', 'barbell']
  },
  {
    id: 'ex-tricep-pushdown',
    title: 'Tricep Pushdowns',
    subtitle: 'Cable Triceps Extension & Lateral Head',
    type: 'exercise',
    url: '/workouts/arms',
    keywords: ['tricep', 'pushdown', 'arms', 'cable']
  },

  // --- Fitness Tools & Precision Calculators ---
  {
    id: 'tool-bench-1rm',
    title: 'Bench Press 1RM Calculator',
    subtitle: 'Calculate your One Rep Maximum for Bench Press',
    type: 'tool',
    url: '/tools?tab=1rm',
    keywords: ['bench', 'bench press', '1rm', 'one rep max', 'calculator', 'strength', 'tool', 'lift']
  },
  {
    id: 'tool-1rm',
    title: '1RM (One Rep Max) Calculator',
    subtitle: 'Brzycki, Epley & Lombardi Strength Formulas',
    type: 'tool',
    url: '/tools?tab=1rm',
    keywords: ['1rm', 'one rep max', 'strength', 'bench', 'squat', 'deadlift', 'calculator', 'tool']
  },
  {
    id: 'tool-macro',
    title: 'Macro & Calorie Calculator',
    subtitle: 'Mifflin-St Jeor BMR, TDEE & Nutrition Targets',
    type: 'tool',
    url: '/tools?tab=macro',
    keywords: ['macro', 'macros', 'calorie', 'calories', 'tdee', 'bmr', 'nutrition', 'protein', 'calculator', 'diet']
  },
  {
    id: 'tool-calorie',
    title: 'Daily Calorie & TDEE Calculator',
    subtitle: 'Maintenance Calories, Deficit/Surplus & Zigzag Cycling',
    type: 'tool',
    url: '/tools?tab=calorie',
    keywords: ['calorie', 'calories', 'tdee', 'bmr', 'energy', 'deficit', 'surplus', 'cut', 'bulk', 'zigzag', 'maintenance', 'calculator', 'tool']
  },
  {
    id: 'tool-bmi',
    title: 'Body Mass Index (BMI) Calculator',
    subtitle: 'Assess Body Composition & Weight Categories',
    type: 'tool',
    url: '/tools?tab=bmi',
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'calculator', 'tool']
  },

  // --- Workout Categories ---
  {
    id: 'cat-chest',
    title: 'Chest Workouts',
    subtitle: 'Browse all pectorals & pressing routines',
    type: 'category',
    url: '/workouts/chest',
    keywords: ['chest', 'bench', 'pecs', 'workouts', 'category']
  },
  {
    id: 'cat-back',
    title: 'Back Workouts',
    subtitle: 'Browse all lats, rows, and pulling routines',
    type: 'category',
    url: '/workouts/back',
    keywords: ['back', 'lats', 'deadlift', 'rows', 'workouts', 'category']
  },
  {
    id: 'cat-legs',
    title: 'Legs Workouts',
    subtitle: 'Browse all quads, hamstrings & calves exercises',
    type: 'category',
    url: '/workouts/legs',
    keywords: ['legs', 'squat', 'quads', 'hamstrings', 'workouts', 'category']
  },
  {
    id: 'cat-shoulders',
    title: 'Shoulders Workouts',
    subtitle: 'Browse all deltoids & overhead routines',
    type: 'category',
    url: '/workouts/shoulders',
    keywords: ['shoulders', 'delts', 'press', 'workouts', 'category']
  },
  {
    id: 'cat-arms',
    title: 'Arms Workouts',
    subtitle: 'Browse all biceps & triceps routines',
    type: 'category',
    url: '/workouts/arms',
    keywords: ['arms', 'biceps', 'triceps', 'curls', 'dips', 'workouts', 'category']
  },
  {
    id: 'cat-abs',
    title: 'Abs & Core Workouts',
    subtitle: 'Browse all core, oblique, and abdominal exercises',
    type: 'category',
    url: '/workouts/abs',
    keywords: ['abs', 'core', 'plank', 'crunches', 'workouts', 'category']
  },

  // --- Athletic Recipes ---
  {
    id: 'recipe-cranberry-oats',
    title: 'Cranberry Cheesecake Overnight Oats',
    subtitle: 'High Protein Make-Ahead Breakfast · 17g Protein',
    type: 'recipe',
    url: '/recipes/cranberry-cheesecake-overnight-oats',
    keywords: ['oats', 'overnight', 'breakfast', 'protein', 'cheesecake', 'cranberry', 'recipe']
  },
  {
    id: 'recipe-veggie-wraps',
    title: 'Veggie Wraps',
    subtitle: 'Skillet Veggie Wrap with Hummus & Feta · 15 Min',
    type: 'recipe',
    url: '/recipes/veggie-wraps',
    keywords: ['wrap', 'veggie', 'hummus', 'snack', 'lunch', 'recipe']
  },
  {
    id: 'recipe-chopped-salad',
    title: 'Crunchy Chopped Salad',
    subtitle: 'Chickpea & Miso Ginger Salad · Clean Nutrition',
    type: 'recipe',
    url: '/recipes/crunchy-chopped-salad',
    keywords: ['salad', 'chickpea', 'healthy', 'vegan', 'recipe']
  },
  {
    id: 'recipe-three-bean',
    title: 'Three Bean Salad',
    subtitle: 'High Fiber & Protein Plant Fuel · Meal Prep',
    type: 'recipe',
    url: '/recipes/three-bean-salad',
    keywords: ['bean', 'salad', 'protein', 'fiber', 'recipe']
  },

  // --- Evidence-Based Articles ---
  {
    id: 'article-creatine',
    title: 'What is Creatine? Why Should I Consume It?',
    subtitle: 'Sports Science · Energy, ATP & Strength Output',
    type: 'article',
    url: '/articles/creatine-what-and-why',
    keywords: ['creatine', 'supplement', 'atp', 'strength', 'muscle', 'article']
  },
  {
    id: 'article-injury',
    title: '3 Tips for Avoiding Injury at the Gym',
    subtitle: 'Training Safety · Progressive Overload & POLICE Protocol',
    type: 'article',
    url: '/articles/3-tips-avoid-gym-injury',
    keywords: ['injury', 'safety', 'gym', 'overload', 'recovery', 'article']
  },
  {
    id: 'article-protein-shakes',
    title: 'Do I Need Protein Shakes?',
    subtitle: 'Nutrition Fundamentals · Whey, Plant & Daily Protein Targets',
    type: 'article',
    url: '/articles/do-i-need-protein-shakes',
    keywords: ['protein', 'shakes', 'whey', 'diet', 'nutrition', 'article']
  },
]

// Scoring and matching algorithm
export function getLocalSuggestions(rawQuery: string, limit = 7): SuggestionItem[] {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return []

  const scored = STATIC_SEARCH_CATALOG.map((item) => {
    let score = 0
    const lowerTitle = item.title.toLowerCase()
    const lowerSubtitle = item.subtitle.toLowerCase()
    const words = lowerTitle.split(/\s+/)

    if (lowerTitle === query) {
      score += 150 // Exact match
    } else if (lowerTitle.startsWith(query)) {
      score += 100 // Title begins with query (e.g. "ben" -> "Bench Press")
    } else if (words.some((w) => w.startsWith(query))) {
      score += 75 // Word in title begins with query (e.g. "press" -> "Bench Press")
    } else if (lowerTitle.includes(query)) {
      score += 50 // Substring match in title
    } else if (item.keywords?.some((k) => k.toLowerCase().startsWith(query))) {
      score += 35 // Keyword prefix match
    } else if (lowerSubtitle.includes(query)) {
      score += 20 // Subtitle match
    } else if (item.keywords?.some((k) => k.toLowerCase().includes(query))) {
      score += 15 // Keyword substring match
    }

    return { item, score }
  })

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item)
}

// Hybrid suggestion fetcher (instant local catalog + Supabase async query)
export async function fetchSearchSuggestions(rawQuery: string, limit = 7): Promise<SuggestionItem[]> {
  const query = rawQuery.trim()
  if (!query) return []

  // Step 1: Get high-relevance static suggestions instantly
  const localMatches = getLocalSuggestions(query, limit)

  try {
    // Step 2: Try querying Supabase concurrently for any dynamic content
    const pattern = `%${query}%`
    const [workoutsRes, recipesRes, articlesRes] = await Promise.all([
      supabase.from('workouts').select('title, slug, description').ilike('title', pattern).limit(4),
      supabase.from('recipes').select('title, slug, description').ilike('title', pattern).limit(3),
      supabase.from('articles').select('title, slug').ilike('title', pattern).limit(3),
    ])

    const dbItems: SuggestionItem[] = []

    if (workoutsRes.data) {
      for (const w of workoutsRes.data) {
        dbItems.push({
          id: `db-workout-${w.slug}`,
          title: w.title,
          subtitle: w.description ? w.description.slice(0, 60) + '...' : 'Workout Exercise',
          type: 'exercise',
          url: `/workouts/${w.slug.split('-')[0]}`,
        })
      }
    }

    if (recipesRes.data) {
      for (const r of recipesRes.data) {
        dbItems.push({
          id: `db-recipe-${r.slug}`,
          title: r.title,
          subtitle: 'Healthy Recipe',
          type: 'recipe',
          url: `/recipes/${r.slug}`,
        })
      }
    }

    if (articlesRes.data) {
      for (const a of articlesRes.data) {
        dbItems.push({
          id: `db-article-${a.slug}`,
          title: a.title,
          subtitle: 'Fitness & Health Article',
          type: 'article',
          url: `/articles/${a.slug}`,
        })
      }
    }

    // Merge without duplicate titles
    const seenTitles = new Set<string>()
    const combined: SuggestionItem[] = []

    // Local items get priority since they are hand-curated with rich links and subtitles
    for (const item of localMatches) {
      const normalized = item.title.trim().toLowerCase()
      if (!seenTitles.has(normalized)) {
        seenTitles.add(normalized)
        combined.push(item)
      }
    }

    // Add any unique database items
    for (const item of dbItems) {
      const normalized = item.title.trim().toLowerCase()
      if (!seenTitles.has(normalized)) {
        seenTitles.add(normalized)
        combined.push(item)
      }
    }

    return combined.slice(0, limit)
  } catch {
    // If Supabase fails or is offline, fallback immediately to local curated matches
    return localMatches
  }
}
