import { useState } from 'react'
import BackLink from '../components/Backlink'
import '../assets/CSS/Calculators.css'

type BmiCategory = 'Underweight' | 'Healthy' | 'Overweight' | 'Obese' | null

const SCALE_MIN = 12
const SCALE_MAX = 40

function getCategory(bmi: number): { label: BmiCategory; bg: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', bg: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }
  if (bmi < 25) return { label: 'Healthy', bg: 'rgba(52, 211, 153, 0.15)', color: '#34D399' }
  if (bmi < 30) return { label: 'Overweight', bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24' }
  return { label: 'Obese', bg: 'rgba(248, 113, 113, 0.15)', color: '#F87171' }
}

function BmiCalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    const h = parseFloat(height)
    const w = parseFloat(weight)

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setError('Please enter valid height and weight values.')
      setBmi(null)
      return
    }

    setError(null)
    const result = w / ((h / 100) * (h / 100))
    setBmi(result)
  }

  const handleReset = () => {
    setHeight('')
    setWeight('')
    setBmi(null)
    setError(null)
  }

  const category = bmi !== null ? getCategory(bmi) : null
  const markerPercent =
    bmi !== null
      ? ((Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100
      : null

  return (
    <div className="container calculator-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <BackLink to="/tools" label="All Fitness Tools" />
      <div className="lane-header">
        <span className="lane-tag">Metric</span>
        <div className="lane-line" />
      </div>
      <h1>BMI Calculator</h1>
      <p style={{ marginTop: '-8px' }}>
        Body Mass Index calculates body fat based on height and weight.
      </p>

      <div className="card calc-card">
        <form onSubmit={handleCalculate}>
          <div className="calc-form-grid">
            <div>
              <label htmlFor="bmi-height">Height (cm)</label>
              <input
                id="bmi-height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
              />
            </div>

            <div>
              <label htmlFor="bmi-weight">Weight (kg)</label>
              <input
                id="bmi-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
              />
            </div>
          </div>

          {error && <p className="calc-error">{error}</p>}

          <div className="calc-actions">
            <button type="submit">Calculate BMI</button>
            <button type="button" className="secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>

        {bmi !== null && (
          <div className="calc-result-card">
            <div className="calc-result-header">
              <div>
                <div className="stat-label">Your Body Mass Index</div>
                <div className="calc-value-display">
                  <span className="stat-hero">{bmi.toFixed(1)}</span>
                  <span className="calc-value-unit">BMI</span>
                </div>
              </div>

              {category && (
                <div
                  className="calc-category-badge"
                  style={{ background: category.bg, color: category.color, border: `1px solid ${category.color}40` }}
                >
                  ● {category.label}
                </div>
              )}
            </div>

            {/* Visual Gauge Track */}
            <div className="bmi-gauge-track">
              {markerPercent !== null && (
                <div
                  className="bmi-gauge-marker"
                  style={{ left: `${markerPercent}%` }}
                />
              )}
            </div>

            <div className="bmi-legend">
              <div className="bmi-legend-item">
                <strong style={{ color: '#38BDF8' }}>&lt; 18.5</strong>
                <span>Underweight</span>
              </div>
              <div className="bmi-legend-item">
                <strong style={{ color: '#34D399' }}>18.5 – 24.9</strong>
                <span>Healthy</span>
              </div>
              <div className="bmi-legend-item">
                <strong style={{ color: '#FBBF24' }}>25.0 – 29.9</strong>
                <span>Overweight</span>
              </div>
              <div className="bmi-legend-item">
                <strong style={{ color: '#F87171' }}>&ge; 30.0</strong>
                <span>Obese</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BmiCalculator