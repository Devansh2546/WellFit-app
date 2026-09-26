export interface Category {
  id: number
  slug: string
  name: string
  image_url: string | null
}

export interface Workout {
  id: number
  category_id: number
  title: string
  slug: string
  description: string
  instructions: string[]
  video_url: string | null
  requires_login: boolean
  log_type: 'weight' | 'duration' | 'bodyweight'
}

export interface Article {
  id: number
  slug: string
  title: string
  cover_image: string | null
  body: string
  requires_login: boolean
  published_at: string
}

export interface Recipe {
  id: number
  slug: string
  title: string
  description: string
  cover_image: string | null
  prep_time_minutes: number
  total_time_minutes: number
  servings: number
  tags: string[]
  ingredients: string[]
  steps: { title: string; description: string }[]
  requires_login: boolean
}

export interface RecipeNutrients {
  recipe_id: number
  calories: number
  fat_g: number
  carbs_g: number
  protein_g: number
}