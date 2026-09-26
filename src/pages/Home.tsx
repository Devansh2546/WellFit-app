import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import useCountUp from '../hooks/useCountUp'
import useScrollReveal from '../hooks/useScrollReveal'
import '../assets/CSS/Home.css'

interface Counts {
  workouts: number
  categories: number
  articles: number
  recipes: number
}

function StatCounter({ value, label }: { value: number; label: string }) {
  const animated = useCountUp(value)
  return (
    <div>
      <div className="stat stat-lg">{String(animated).padStart(2, '0')}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Home() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<Counts>({ workouts: 0, categories: 0, articles: 0, recipes: 0 })
  const [heroVisible, setHeroVisible] = useState(false)
  const { ref: featuresRef, visible: featuresVisible } = useScrollReveal<HTMLElement>()

  useEffect(() => {
    async function loadCounts() {
      const { data, error } = await supabase.rpc('get_content_counts')
      if (error) {
        console.error(error)
        return
      }
      const row = data?.[0]
      if (row) {
        setCounts({
          workouts: row.workouts_count ?? 0,
          categories: row.categories_count ?? 0,
          articles: row.articles_count ?? 0,
          recipes: row.recipes_count ?? 0,
        })
      }
    }
    loadCounts()

    // Trigger entrance animation on mount
    const t = setTimeout(() => setHeroVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className={`container hero-inner ${heroVisible ? 'hero-visible' : ''}`}>
          <div className="hero-badge fade-item" style={{ transitionDelay: '0ms' }}>
            <span className="hero-badge-dot" />
            Precision Training & Performance Ledger
          </div>

          <h1 className="hero-headline fade-item" style={{ transitionDelay: '80ms' }}>
            Every rep, set & macro.<br />
            <span className="hero-gradient-text">Timed & perfected.</span>
          </h1>

          <p className="hero-sub fade-item" style={{ transitionDelay: '160ms' }}>
            {counts.workouts || '50+'} exercises across {counts.categories || '12'} categories, real nutrition
            data on every recipe, and a fitness assistant that answers your questions — not someone else's marketing copy.
          </p>

          <div className="hero-actions fade-item" style={{ transitionDelay: '240ms' }}>
            <Link to="/workouts" className="btn">
              Browse Workouts →
            </Link>
            <Link to="/tools?tab=bmi" className="btn secondary">
              Calculate BMI
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Live Stat Strip ---------- */}
      <section className="container stat-strip">
        <StatCounter value={counts.workouts} label="Exercises" />
        <StatCounter value={counts.categories} label="Categories" />
        <StatCounter value={counts.articles} label="Articles" />
        <StatCounter value={counts.recipes} label="Recipes" />
      </section>

      {/* ---------- Features ("Find Your Session") ---------- */}
      <section
        ref={featuresRef}
        className={`container ${featuresVisible ? 'section-visible' : 'section-hidden'}`}
        style={{ paddingTop: 'calc(var(--space-6) * 1.2)', paddingBottom: 'var(--space-6)' }}
      >
        <div className="features-section-header">
          <div className="section-pill-tag">
            <span className="section-pill-dot" /> Explore WellFit
          </div>
          <h2 className="features-title">Find Your Session</h2>
          <p className="features-subtitle">
            Curated workouts, precision calculators, macro-accurate recipes, and expert training reads.
          </p>
        </div>

        <div className="card-grid">
          {[
            { to: '/workouts', title: 'Workouts', category: 'Training', text: 'Step-by-step form guidance for chest, back, legs, boxing, yoga, and more.', image: 'workouts.jpg' },
            { to: '/tools', title: 'Tools', category: 'Tools', text: 'Precision fitness calculators including BMI and One-Rep Max to track and optimize your fitness.', image: 'tools.jpg' },
            { to: '/recipes', title: 'Recipes', category: 'Nutrition', text: 'Prep time, servings, and full macro breakdown on every dish.', image: 'recipes.jpg' },
            { to: '/articles', title: 'Articles', category: 'Recovery', text: 'Short, practical reads on nutrition, injury prevention, and recovery.', image: 'articles.jpg' },
          ].map((item, i) => (
            <Link key={item.to} to={item.to} className="feature-card-link rise-item" style={{ transitionDelay: `${i * 80}ms` }}>
              <div
                className="feature-card"
              >
                <div
                  className="feature-card-img"
                  style={{ backgroundImage: `url(/Images/features/${item.image})` }}
                />
                <span className="feature-card-tag">{item.category}</span>
                <div className="feature-card-overlay">
                  <div className="feature-card-title-row">
                    <h3>{item.title}</h3>
                    <span className="feature-card-arrow" aria-hidden="true">&rarr;</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Secondary CTA ---------- */}
      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2 style={{ marginBottom: '6px' }}>Have a question mid-workout?</h2>
            <p style={{ margin: 0 }}>Ask the WellFit assistant — trained specifically on fitness, form, and nutrition.</p>
          </div>
          <Link to={user ? '/workouts' : '/login'} className="btn">
            {user ? 'Browse Workouts →' : 'Get Started Free →'}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home