import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Article } from '../types/Index'
import Spinner from '../components/Spinner'
import '../assets/CSS/Articles.css'

function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setArticles(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <Spinner label="Loading Articles" />

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <div className="lane-header">
        <span className="lane-tag">{String(articles.length).padStart(2, '0')}</span>
        <div className="lane-line" />
      </div>
      <h1>Articles</h1>

      <div className="card-grid" style={{ marginTop: 'var(--space-4)' }}>
        {articles.map((a) => (
          <Link key={a.id} to={`/articles/${a.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card article-card">
              {a.cover_image && (
                <img
                  src={`/Images/articles/${a.cover_image}`}
                  alt={a.title}
                  loading="lazy"
                  className="article-card-img"
                />
              )}
              <h3 className="article-card-title">{a.title}</h3>
              <span className="article-card-date">
                {new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Articles