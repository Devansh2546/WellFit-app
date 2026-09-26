import { useState } from 'react'
import BackLink from '../components/Backlink'
import '../assets/CSS/Calculators.css'

const exerciseNotes: Record<string, string> = {
  bench: 'Bench Press: Keep your feet flat, shoulders retracted, and maintain a slight arch in your back.',
  squat: 'Squat: Keep your chest up, knees tracking over toes, and maintain proper depth (hip crease below knee).',
  deadlift: 'Deadlift: Keep the bar close to your body, maintain a neutral spine, and engage your lats.',
  overhead: 'Overhead Press: Keep your core tight, avoid excessive back arch, and press straight up.',
  row: 'Barbell Row: Maintain a neutral spine, pull to your lower chest, and keep your core engaged.',
}

// Brzycki formula
function calculateOneRM(weight: number, reps: number): number {
  return weight * (36 / (37 - reps))
}

function formatNumber(num: number): number {
  return Math.round(num * 10) / 10
}

function OneRepMaxCalculator() {
  const [exercise, setExercise] = useState('bench')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [oneRM, setOneRM] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    const w = parseFloat(weight)
    const r = parseFloat(reps)

    if (!w || !r || w <= 0 || r <= 0 || r >= 37) {
      setError('Please enter valid weight and reps (1-36).')
      setOneRM(null)
      return
    }

    setError(null)
    setOneRM(formatNumber(calculateOneRM(w, r)))
  }

  const handleReset = () => {
    setWeight('')
    setReps('')
    setOneRM(null)
    setError(null)
    setExercise('bench')
  }

  return (
    <div className="container calculator-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <BackLink to="/tools" label="All Fitness Tools" />
      <div className="lane-header">
        <span className="lane-tag">Power</span>
        <div className="lane-line" />
      </div>
      <h1>One Rep Max Calculator</h1>
      <p style={{ marginTop: '-8px' }}>
        Estimate your maximum single-rep lift using the Brzycki strength formula.
      </p>

      <div className="card calc-card">
        <form onSubmit={handleCalculate}>
          <div className="calc-form-grid">
            <div className="calc-full-width">
              <label htmlFor="orm-exercise">Exercise</label>
              <select id="orm-exercise" value={exercise} onChange={(e) => setExercise(e.target.value)}>
                <option value="bench">Bench Press</option>
                <option value="squat">Squat</option>
                <option value="deadlift">Deadlift</option>
                <option value="overhead">Overhead Press</option>
                <option value="row">Barbell Row</option>
              </select>
            </div>

            <div>
              <label htmlFor="orm-weight">Weight lifted (kg)</label>
              <input
                id="orm-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 80"
              />
            </div>

            <div>
              <label htmlFor="orm-reps">Reps performed</label>
              <input
                id="orm-reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </div>

          {error && <p className="calc-error">{error}</p>}

          <div className="calc-actions">
            <button type="submit">Calculate 1RM</button>
            <button type="button" className="secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {oneRM !== null && (
          <div className="calc-result-card">
            <div className="calc-result-header">
              <div>
                <div className="stat-label">Estimated 1 Rep Max</div>
                <div className="calc-value-display">
                  <span className="stat-hero">{oneRM}</span>
                  <span className="calc-value-unit">kg</span>
                </div>
              </div>
            </div>

            <div className="form-tips-card">
              <div className="form-tips-title">Form Cue</div>
              <div>{exerciseNotes[exercise]}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OneRepMaxCalculator