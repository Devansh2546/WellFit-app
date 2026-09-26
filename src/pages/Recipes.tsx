import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../types/Index'
import Spinner from '../components/Spinner'
import '../assets/CSS/Recipes.css'

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*')
      .order('title')
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setRecipes(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner label="Loading Recipes" />

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <div className="lane-header">
        <span className="lane-tag">{String(recipes.length).padStart(2, '0')}</span>
        <div className="lane-line" />
      </div>
      <h1>Recipes</h1>

      {recipes.length === 0 ? (
        <div className="card" style={{ marginTop: 'var(--space-4)', textAlign: 'center', padding: 'var(--space-5)' }}>
          <p style={{ color: 'var(--color-text-dim)', margin: 0 }}>No recipes available at the moment.</p>
        </div>
      ) : (
        <div className="card-grid" style={{ marginTop: 'var(--space-4)' }}>
          {recipes.map((r) => (
            <Link key={r.id} to={`/recipes/${r.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card recipe-card">
                {r.cover_image && (
                  <img
                    src={`/Images/recipes/${r.cover_image}`}
                    alt={r.title}
                    loading="lazy"
                    className="recipe-card-img"
                  />
                )}
                <h3 className="recipe-card-title">{r.title}</h3>
                <div className="recipe-card-meta">
                  <span className="recipe-meta-pill">
                    {r.prep_time_minutes} <span>min</span>
                  </span>
                  <span className="recipe-meta-pill">
                    {r.servings} <span>servings</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recipes