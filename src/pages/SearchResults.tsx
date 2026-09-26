import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Workout, Article, Recipe } from '../types/Index'
import Spinner from '../components/Spinner'
import '../assets/CSS/SearchResults.css'

function SearchResults() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') ?? ''

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [articles, setArticles] = useState<Article[]>([])
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!query) {
            setWorkouts([])
            setArticles([])
            setRecipes([])
            setLoading(false)
            return
        }

        async function runSearch() {
            setLoading(true)
            const pattern = `%${query}%`

            const [w, a, r] = await Promise.all([
                supabase.from('workouts').select('*').ilike('title', pattern).limit(20),
                supabase.from('articles').select('*').ilike('title', pattern).limit(20),
                supabase.from('recipes').select('*').ilike('title', pattern).limit(20),
            ])

            setWorkouts(w.data ?? [])
            setArticles(a.data ?? [])
            setRecipes(r.data ?? [])
            setLoading(false)
        }

        runSearch()
    }, [query])

    const totalResults = workouts.length + articles.length + recipes.length

    return (
        <div className="container search-results-container">
            <div className="lane-header">
                <span className="lane-tag">{String(totalResults).padStart(2, '0')}</span>
                <div className="lane-line" />
            </div>
            <div className="search-results-header">
                <h1>Results for <span className="search-results-query">"{query}"</span></h1>
            </div>

            {loading && <Spinner label="Searching database..." />}

            {!loading && totalResults === 0 && (
                <div className="search-empty-state">
                    <p>
                        No matches found for "{query}". Try checking your spelling, using broader keywords,
                        or note that some exercises are exclusively available when logged into your account.
                    </p>
                </div>
            )}

            {!loading && workouts.length > 0 && (
                <div className="search-section">
                    <div className="lane-header">
                        <span className="lane-tag">Workouts ({workouts.length})</span>
                        <div className="lane-line" />
                    </div>
                    <div className="card-grid">
                        {workouts.map((w) => (
                            <Link key={w.id} to={`/workouts/${w.slug.split('-')[0]}`} className="search-item-link">
                                <div className="card search-item-card">
                                    <h3 className="search-item-title">{w.title}</h3>
                                    <p className="search-item-desc">{w.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!loading && articles.length > 0 && (
                <div className="search-section">
                    <div className="lane-header">
                        <span className="lane-tag">Articles ({articles.length})</span>
                        <div className="lane-line" />
                    </div>
                    <div className="card-grid">
                        {articles.map((a) => (
                            <Link key={a.id} to={`/articles/${a.slug}`} className="search-item-link">
                                <div className="card search-item-card">
                                    <h3 className="search-item-title">{a.title}</h3>
                                    <span className="search-item-meta">Article</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!loading && recipes.length > 0 && (
                <div className="search-section">
                    <div className="lane-header">
                        <span className="lane-tag">Recipes ({recipes.length})</span>
                        <div className="lane-line" />
                    </div>
                    <div className="card-grid">
                        {recipes.map((r) => (
                            <Link key={r.id} to={`/recipes/${r.slug}`} className="search-item-link">
                                <div className="card search-item-card">
                                    <h3 className="search-item-title">{r.title}</h3>
                                    <span className="search-item-meta">{r.prep_time_minutes} min prep &middot; {r.servings} servings</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchResults