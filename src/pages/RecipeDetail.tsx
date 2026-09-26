import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Recipe, RecipeNutrients } from '../types/Index'
import BackLink from '../components/Backlink'
import Spinner from '../components/Spinner'
import '../assets/CSS/Recipes.css'

function RecipeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [nutrients, setNutrients] = useState<RecipeNutrients | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (recipeError || !recipeData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setRecipe(recipeData)

      const { data: nutrientData } = await supabase
        .from('recipe_nutrients')
        .select('*')
        .eq('recipe_id', recipeData.id)
        .single()

      setNutrients(nutrientData)
      setLoading(false)
    }

    load()
  }, [slug])

  if (loading) return <Spinner label="Loading Recipe" />
  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5)' }}>
        <BackLink to="/recipes" label="All Recipes" />
        <p>Recipe not found or no longer available.</p>
      </div>
    )
  }

  return (
    <div className="container recipe-detail-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <BackLink to="/recipes" label="All Recipes" />

      {recipe?.cover_image && (
        <img
          src={`/Images/recipes/${recipe?.cover_image}`}
          alt={recipe.title}
          loading="lazy"
          className="recipe-cover-hero"
        />
      )}

      <h1 className="recipe-title">{recipe?.title}</h1>
      <p className="recipe-desc">{recipe?.description}</p>

      {recipe?.tags && (
        <div className="recipe-tags-wrap">
          {recipe.tags.map((tag) => (
            <span key={tag} className="recipe-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="recipe-stats-strip">
        <div className="recipe-stat-cell">
          <div className="stat stat-lg">{recipe?.prep_time_minutes}</div>
          <div className="stat-label">Prep (min)</div>
        </div>
        <div className="recipe-stat-cell">
          <div className="stat stat-lg">{recipe?.total_time_minutes}</div>
          <div className="stat-label">Total (min)</div>
        </div>
        <div className="recipe-stat-cell">
          <div className="stat stat-lg">{recipe?.servings}</div>
          <div className="stat-label">Servings</div>
        </div>
      </div>

      {nutrients && (
        <>
          <div className="lane-header">
            <span className="lane-tag">Nutrients</span>
            <div className="lane-line" />
          </div>
          <div className="recipe-nutrients-grid">
            <div className="nutrient-cell">
              <div className="stat">{nutrients.calories}</div>
              <div className="stat-label">Calories</div>
            </div>
            <div className="nutrient-cell">
              <div className="stat">{nutrients.protein_g}g</div>
              <div className="stat-label">Protein</div>
            </div>
            <div className="nutrient-cell">
              <div className="stat">{nutrients.carbs_g}g</div>
              <div className="stat-label">Carbs</div>
            </div>
            <div className="nutrient-cell">
              <div className="stat">{nutrients.fat_g}g</div>
              <div className="stat-label">Fat</div>
            </div>
          </div>
        </>
      )}

      <div className="lane-header">
        <span className="lane-tag">Ingredients</span>
        <div className="lane-line" />
      </div>
      <ul className="recipe-ingredients-list">
        {recipe?.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
      </ul>

      <div className="lane-header">
        <span className="lane-tag">Steps</span>
        <div className="lane-line" />
      </div>
      <div className="recipe-steps-list">
        {recipe?.steps.map((step, i) => (
          <div key={i} className="recipe-step-item">
            <div className="recipe-step-header">
              <span className="recipe-step-badge">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="recipe-step-title">{step.title}</h3>
            </div>
            <p className="recipe-step-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeDetail