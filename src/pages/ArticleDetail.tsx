import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import type { Article } from '../types/Index'
import BackLink from '../components/Backlink'
import Spinner from '../components/Spinner'
import '../assets/CSS/Articles.css'

function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setArticle(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <Spinner label="Loading Article" />

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-5)' }}>
        <BackLink to="/articles" label="All Articles" />
        <p>Article not found or no longer available.</p>
      </div>
    )
  }

  return (
    <div className="container article-reader-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <BackLink to="/articles" label="All Articles" />

      {article?.cover_image && (
        <img
          src={`/Images/articles/${article?.cover_image}`}
          alt={article.title}
          loading="lazy"
          className="article-cover-hero"
        />
      )}
      <h1 className="article-reader-title">{article?.title}</h1>

      <div className="article-body">
        <ReactMarkdown>{(article?.body ?? '').replace(/^[ \t]+/gm, '')}</ReactMarkdown>
      </div>
    </div>
  )
}

export default ArticleDetail