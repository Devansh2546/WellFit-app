import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Workout, Category } from '../types/Index'
import BackLink from '../components/Backlink'
import LogWorkoutForm from '../components/LogWorkoutForm'
import Spinner from '../components/Spinner'
import '../assets/CSS/Workouts.css'

function WorkoutCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .single()

      if (catError || !catData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setCategory(catData)

      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .select('*')
        .eq('category_id', catData.id)
        .order('title')

      if (workoutError) console.error(workoutError)
      setWorkouts(workoutData ?? [])
      setLoading(false)
    }

    load()
  }, [categorySlug])

  if (loading) return <Spinner label="Loading workouts" />
  if (notFound) return <p className="container" style={{ paddingTop: 'var(--space-5)' }}>Category not found.</p>

  return (
    <div className="container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <BackLink to="/workouts" label="All Workout Categories" />
      <div className="lane-header">
        <span className="lane-tag">{String(workouts.length).padStart(2, '0')}</span>
        <div className="lane-line" />
      </div>
      <h1>{category?.name} Exercises</h1>

      <div className="exercise-card-list">
        {workouts.map((w, i) => (
          <div key={w.id} className="card exercise-card">
            <div className="lane-header">
              <span className="stat">{String(i + 1).padStart(2, '0')}</span>
              <div className="lane-line" />
            </div>
            <h2 className="exercise-title">{w.title}</h2>
            <p className="exercise-desc">{w.description}</p>

            <div className="exercise-instructions-title">Instructions</div>
            <ol className="exercise-steps">
              {w.instructions.map((step, j) => (
                <li key={j}>{step}</li>
              ))}
            </ol>

            {w.video_url && (
              <video
                controls
                preload="metadata"
                className="exercise-video"
              >
                <source src={w.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <LogWorkoutForm workoutId={w.id} logType={w.log_type} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkoutCategory