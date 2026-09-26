import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Category } from '../types/Index'
import Spinner from '../components/Spinner'
import '../assets/CSS/Workouts.css'

function Workouts() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setCategories(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner label="Loading Categories" />

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <div className="lane-header">
        <span className="lane-tag">{String(categories.length).padStart(2, '0')}</span>
        <div className="lane-line" />
      </div>
      <h1>Workout Categories</h1>

      <div className="card-grid" style={{ marginTop: 'var(--space-4)' }}>
        {categories.map((cat, i) => (
          <Link key={cat.id} to={`/workouts/${cat.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card category-card">
              <div className="category-image-wrap">
                {cat.image_url ? (
                  <img
                    src={`/Images/Categories/${cat.image_url}`}
                    alt={cat.name}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-alt)' }} />
                )}
                <span className="category-number-badge">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="category-title">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Workouts
