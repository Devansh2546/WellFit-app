import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../assets/CSS/Calculators.css'
import '../assets/CSS/Tools.css'
import CalorieCalculator from '../components/CalorieCalculator'

// --- BMI Types & Constants ---
type BmiCategory = 'Underweight' | 'Healthy' | 'Overweight' | 'Obese' | null

const SCALE_MIN = 12
const SCALE_MAX = 40

function getCategory(bmi: number): { label: BmiCategory; bg: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', bg: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }
  if (bmi < 25) return { label: 'Healthy', bg: 'rgba(52, 211, 153, 0.15)', color: '#34D399' }
  if (bmi < 30) return { label: 'Overweight', bg: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24' }
  return { label: 'Obese', bg: 'rgba(248, 113, 113, 0.15)', color: '#F87171' }
}

// --- 1RM Types & Constants ---
const exerciseNotes: Record<string, string> = {
  bench: 'Bench Press: Keep your feet flat, shoulders retracted, and maintain a slight arch in your back.',
  squat: 'Squat: Keep your chest up, knees tracking over toes, and maintain proper depth (hip crease below knee).',
  deadlift: 'Deadlift: Keep the bar close to your body, maintain a neutral spine, and engage your lats.',
  overhead: 'Overhead Press: Keep your core tight, avoid excessive back arch, and press straight up.',
  row: 'Barbell Row: Maintain a neutral spine, pull to your lower chest, and keep your core engaged.',
}

function calculateOneRM(weight: number, reps: number): number {
  return weight * (36 / (37 - reps))
}

function formatNumber(num: number): number {
  return Math.round(num * 10) / 10
}

// --- Macro Types & Constants (Mifflin-St Jeor & TDEE) ---
type UnitSystem = 'metric' | 'imperial'
type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
type FitnessGoal = 'cut' | 'maintain' | 'bulk'
type DietSplit = 'balanced' | 'high_protein' | 'low_carb' | 'keto'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: number; label: string; desc: string }> = {
  sedentary: { multiplier: 1.2, label: 'Sedentary', desc: 'Little or no exercise, desk work' },
  light: { multiplier: 1.375, label: 'Lightly Active', desc: 'Light workouts / sports 1–3 days/wk' },
  moderate: { multiplier: 1.55, label: 'Moderately Active', desc: 'Gym training 3–5 days/wk' },
  very: { multiplier: 1.725, label: 'Very Active', desc: 'Hard training / sports 6–7 days/wk' },
  extra: { multiplier: 1.9, label: 'Extra Active', desc: 'Intense daily training & physical job' },
}

// Diet split now only governs the carb:fat ratio of the calories left AFTER protein
// is set from bodyweight. This keeps protein grams realistic regardless of TDEE.
const DIET_SPLITS: Record<DietSplit, { name: string; carbRatio: number; fatRatio: number; desc: string }> = {
  balanced: { name: 'Balanced', carbRatio: 0.55, fatRatio: 0.45, desc: 'Even mix of carbs & fats' },
  high_protein: { name: 'High Protein', carbRatio: 0.55, fatRatio: 0.45, desc: 'Extra protein, even carbs/fats' },
  low_carb: { name: 'Low Carb', carbRatio: 0.30, fatRatio: 0.70, desc: 'Carbs traded for more fat' },
  keto: { name: 'Keto', carbRatio: 0.10, fatRatio: 0.90, desc: 'Very low carb, fat-dominant' },
}

// Protein targets in grams per kg of bodyweight — this is what keeps protein realistic
// (evidence-based ranges rather than an arbitrary % of total calories).
const PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  cut: 2.2, // higher to protect lean muscle mass in a calorie deficit
  maintain: 1.8,
  bulk: 1.6, // surplus already supports muscle gain, so slightly less is needed
}
// "High Protein" split nudges the per-kg target up a bit regardless of goal
const HIGH_PROTEIN_BONUS = 0.3

const GOAL_ADJUSTMENTS: Record<FitnessGoal, { multiplier: number; label: string; desc: string; tip: string }> = {
  cut: {
    multiplier: 0.80,
    label: 'Fat Loss (Cut)',
    desc: '20% moderate calorie deficit',
    tip: 'Prioritize 2.0g–2.2g of protein per kg of body weight to safeguard lean muscle mass while in a calorie deficit.',
  },
  maintain: {
    multiplier: 1.00,
    label: 'Maintenance',
    desc: 'Energy balance & recomposition',
    tip: 'Eating at maintenance TDEE fuels athletic performance, accelerates recovery, and supports body recomposition.',
  },
  bulk: {
    multiplier: 1.12,
    label: 'Muscle Gain (Bulk)',
    desc: '12% lean calorie surplus',
    tip: 'A controlled 10–12% surplus supplies sufficient energy for hypertrophy while minimizing unnecessary fat gain.',
  },
}

interface MacroResult {
  bmr: number
  tdee: number
  targetCalories: number
  proteinGrams: number
  proteinCals: number
  carbGrams: number
  carbCals: number
  fatGrams: number
  fatCals: number
  proteinPct: number
  carbPct: number
  fatPct: number
  perMeal: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const ZERO_MACRO_RESULT: MacroResult = {
  bmr: 0,
  tdee: 0,
  targetCalories: 0,
  proteinGrams: 0,
  proteinCals: 0,
  carbGrams: 0,
  carbCals: 0,
  fatGrams: 0,
  fatCals: 0,
  proteinPct: 0,
  carbPct: 0,
  fatPct: 0,
  perMeal: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
}

function computeMacroMetrics(
  gender: Gender,
  age: number,
  height: number,
  weight: number,
  activity: ActivityLevel,
  goal: FitnessGoal,
  split: DietSplit,
  meals: number
): MacroResult {
  // Mifflin-St Jeor equation
  const bmr = gender === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity].multiplier
  const targetCalories = Math.round(tdee * GOAL_ADJUSTMENTS[goal].multiplier)

  // Protein: set from bodyweight and goal (g/kg), not a percentage of calories.
  // This is what keeps protein grams realistic even at high TDEE.
  const proteinPerKg = PROTEIN_PER_KG[goal] + (split === 'high_protein' ? HIGH_PROTEIN_BONUS : 0)
  const proteinGrams = Math.round(weight * proteinPerKg)
  const proteinCals = proteinGrams * 4

  // Remaining calories are split into carbs/fat using the diet split's ratio
  const splitConfig = DIET_SPLITS[split]
  const remainingCals = Math.max(targetCalories - proteinCals, 0)
  const carbCals = Math.round(remainingCals * splitConfig.carbRatio)
  const fatCals = remainingCals - carbCals

  const carbGrams = Math.round(carbCals / 4)
  const fatGrams = Math.round(fatCals / 9)

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    proteinGrams,
    proteinCals,
    carbGrams,
    carbCals,
    fatGrams,
    fatCals,
    proteinPct: targetCalories > 0 ? Math.round((proteinCals / targetCalories) * 100) : 0,
    carbPct: targetCalories > 0 ? Math.round((carbCals / targetCalories) * 100) : 0,
    fatPct: targetCalories > 0 ? Math.round((fatCals / targetCalories) * 100) : 0,
    perMeal: {
      calories: Math.round(targetCalories / meals),
      protein: Math.round(proteinGrams / meals),
      carbs: Math.round(carbGrams / meals),
      fat: Math.round(fatGrams / meals),
    },
  }
}

function Tools() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'all'

  // BMI state
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiError, setBmiError] = useState<string | null>(null)

  // 1RM state
  const [exercise, setExercise] = useState('bench')
  const [ormWeight, setOrmWeight] = useState('')
  const [ormReps, setOrmReps] = useState('')
  const [oneRM, setOneRM] = useState<number | null>(null)
  const [ormError, setOrmError] = useState<string | null>(null)

  // Macro state - Metric/Imperial units & Live Reactive recalculation
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [gender, setGender] = useState<Gender>('male')
  const [macroAge, setMacroAge] = useState('')
  // Metric inputs
  const [macroHeightCm, setMacroHeightCm] = useState('')
  const [macroWeightKg, setMacroWeightKg] = useState('')
  // Imperial inputs
  const [macroHeightFt, setMacroHeightFt] = useState('')
  const [macroHeightIn, setMacroHeightIn] = useState('')
  const [macroWeightLbs, setMacroWeightLbs] = useState('')

  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<FitnessGoal>('maintain')
  const [split, setSplit] = useState<DietSplit>('balanced')
  const [meals, setMeals] = useState<number>(4)
  const [pulseCalc, setPulseCalc] = useState(false)
  const [macroResult, setMacroResult] = useState<MacroResult>(ZERO_MACRO_RESULT)
  const [macroError, setMacroError] = useState<string | null>(null)

  const handleUnitChange = (newSystem: UnitSystem) => {
    if (newSystem === unitSystem) return
    setUnitSystem(newSystem)
    if (newSystem === 'imperial') {
      if (macroHeightCm.trim()) {
        const cm = parseFloat(macroHeightCm)
        if (!isNaN(cm) && cm > 0) {
          const totalInches = cm / 2.54
          const ft = Math.floor(totalInches / 12)
          const inch = Math.round(totalInches % 12)
          setMacroHeightFt(String(ft))
          setMacroHeightIn(String(inch))
        }
      } else {
        setMacroHeightFt('')
        setMacroHeightIn('')
      }
      if (macroWeightKg.trim()) {
        const kg = parseFloat(macroWeightKg)
        if (!isNaN(kg) && kg > 0) {
          setMacroWeightLbs(String(Math.round(kg * 2.20462)))
        }
      } else {
        setMacroWeightLbs('')
      }
    } else {
      if (macroHeightFt.trim() || macroHeightIn.trim()) {
        const ft = parseFloat(macroHeightFt) || 0
        const inch = parseFloat(macroHeightIn) || 0
        if (ft > 0 || inch > 0) {
          const cm = Math.round((ft * 12 + inch) * 2.54)
          setMacroHeightCm(String(cm))
        }
      } else {
        setMacroHeightCm('')
      }
      if (macroWeightLbs.trim()) {
        const lbs = parseFloat(macroWeightLbs)
        if (!isNaN(lbs) && lbs > 0) {
          const kg = Math.round((lbs / 2.20462) * 10) / 10
          setMacroWeightKg(String(kg))
        }
      } else {
        setMacroWeightKg('')
      }
    }
  }

  const getResolvedMetrics = () => {
    const age = parseFloat(macroAge)
    let heightCm = 0
    let weightKg = 0

    if (unitSystem === 'metric') {
      heightCm = parseFloat(macroHeightCm)
      weightKg = parseFloat(macroWeightKg)
    } else {
      const ft = parseFloat(macroHeightFt) || 0
      const inch = parseFloat(macroHeightIn) || 0
      const lbs = parseFloat(macroWeightLbs) || 0
      heightCm = (ft * 12 + inch) * 2.54
      weightKg = lbs / 2.20462
    }

    return { age, heightCm, weightKg }
  }

  const isValidMetrics = (age: number, heightCm: number, weightKg: number) => {
    return (
      !isNaN(age) &&
      !isNaN(heightCm) &&
      !isNaN(weightKg) &&
      age >= 10 &&
      age <= 110 &&
      heightCm >= 80 &&
      heightCm <= 260 &&
      weightKg >= 25 &&
      weightKg <= 350
    )
  }

  // Live real-time reactive recalculation whenever ANY input or pill changes
  useEffect(() => {
    const { age, heightCm, weightKg } = getResolvedMetrics()
    if (isValidMetrics(age, heightCm, weightKg)) {
      setMacroError(null)
      setMacroResult(computeMacroMetrics(gender, age, heightCm, weightKg, activity, goal, split, meals))
    } else {
      setMacroResult(ZERO_MACRO_RESULT)
    }
  }, [
    unitSystem,
    gender,
    macroAge,
    macroHeightCm,
    macroWeightKg,
    macroHeightFt,
    macroHeightIn,
    macroWeightLbs,
    activity,
    goal,
    split,
    meals,
  ])

  const handleMacroCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const { age, heightCm, weightKg } = getResolvedMetrics()
    if (!isValidMetrics(age, heightCm, weightKg)) {
      setMacroError('Please enter your age, height, and weight to calculate your personalized macros.')
      setMacroResult(ZERO_MACRO_RESULT)
      return
    }
    setMacroError(null)
    setMacroResult(computeMacroMetrics(gender, age, heightCm, weightKg, activity, goal, split, meals))
    setPulseCalc(true)
    setTimeout(() => setPulseCalc(false), 600)
  }

  const handleMacroReset = () => {
    setUnitSystem('metric')
    setGender('male')
    setMacroAge('')
    setMacroHeightCm('')
    setMacroWeightKg('')
    setMacroHeightFt('')
    setMacroHeightIn('')
    setMacroWeightLbs('')
    setActivity('moderate')
    setGoal('maintain')
    setSplit('balanced')
    setMeals(4)
    setMacroError(null)
    setMacroResult(ZERO_MACRO_RESULT)
  }

  const handleBmiCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const h = parseFloat(height)
    const w = parseFloat(weight)

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmiError('Please enter valid height and weight values.')
      setBmi(null)
      return
    }

    setBmiError(null)
    const result = w / ((h / 100) * (h / 100))
    setBmi(result)
  }

  const handleBmiReset = () => {
    setHeight('')
    setWeight('')
    setBmi(null)
    setBmiError(null)
  }

  const handleOrmCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const w = parseFloat(ormWeight)
    const r = parseFloat(ormReps)

    if (!w || !r || w <= 0 || r <= 0 || r >= 37) {
      setOrmError('Please enter valid weight and reps (1-36).')
      setOneRM(null)
      return
    }

    setOrmError(null)
    setOneRM(formatNumber(calculateOneRM(w, r)))
  }

  const handleOrmReset = () => {
    setOrmWeight('')
    setOrmReps('')
    setOneRM(null)
    setOrmError(null)
    setExercise('bench')
  }

  const bmiCategory = bmi !== null ? getCategory(bmi) : null
  const markerPercent =
    bmi !== null
      ? ((Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100
      : null

  return (
    <div
      className="container"
      style={{
        paddingTop: 'var(--space-5)',
        paddingBottom: 'var(--space-6)',
        maxWidth: activeTab === 'macro' || activeTab === 'calorie' ? 'min(1560px, 95vw)' : undefined,
      }}
    >
      {/* Header */}
      <div className="tools-header-wrap">
        <div className="lane-header">
          <span className="lane-tag">03 TOOLS</span>
          <div className="lane-line" />
        </div>
        <h1>Fitness Tools & Calculators</h1>
        <p className="tools-subtitle">
          Precision athletic calculators designed to evaluate body composition, calibrate your training loads,
          and calculate exact daily macronutrient targets.
        </p>
      </div>

      {/* Tabs */}
      <div className="tools-tab-bar" role="tablist" aria-label="Tools navigation">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`tools-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setSearchParams({})}
        >
          <span>All Tools</span>
          <span className="tools-tab-badge">4</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bmi'}
          className={`tools-tab-btn ${activeTab === 'bmi' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: 'bmi' })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>BMI Calculator</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === '1rm'}
          className={`tools-tab-btn ${activeTab === '1rm' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: '1rm' })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
          </svg>
          <span>1RM Calculator</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'macro'}
          className={`tools-tab-btn ${activeTab === 'macro' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: 'macro' })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
          </svg>
          <span>Macro Calculator</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'calorie'}
          className={`tools-tab-btn ${activeTab === 'calorie' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: 'calorie' })}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2c1.5 3 4 5 4 9a6 6 0 0 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 3s3-1 4-3z" />
          </svg>
          <span>Calorie Calculator</span>
        </button>
      </div>

      {/* VIEW 1: All Tools Showcase Cards */}
      {activeTab === 'all' && (
        <div className="tools-grid">
          {/* Card 1: BMI */}
          <div className="tool-showcase-card">
            <div className="tool-card-header">
              <div className="tool-badge-wrap">
                <span className="tool-tag">Body Composition</span>
              </div>
              <div className="tool-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>

            <h3 className="tool-title">BMI Calculator</h3>
            <p className="tool-description">
              Evaluate your Body Mass Index against standard World Health Organization criteria.
              Includes an intuitive visual gauge to easily track underweight, healthy, overweight, and obese thresholds.
            </p>

            <div className="tool-formula-box">
              <span className="tool-formula-label">Formula</span>
              <span className="tool-formula-code">Weight (kg) ÷ [Height (m)]²</span>
            </div>

            <div className="tool-chips-row">
              <span className="tool-chip">WHO Standard</span>
              <span className="tool-chip">Metric Units (cm/kg)</span>
              <span className="tool-chip">Color Gauge</span>
              <span className="tool-chip">Instant Feedback</span>
            </div>

            <div className="tool-actions-row">
              <button
                type="button"
                className="btn"
                onClick={() => setSearchParams({ tab: 'bmi' })}
              >
                Calculate BMI →
              </button>
            </div>
          </div>

          {/* Card 2: 1RM */}
          <div className="tool-showcase-card">
            <div className="tool-card-header">
              <div className="tool-badge-wrap">
                <span className="tool-tag">Strength & Power</span>
              </div>
              <div className="tool-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                </svg>
              </div>
            </div>

            <h3 className="tool-title">One Rep Max (1RM) Calculator</h3>
            <p className="tool-description">
              Estimate your maximum single-rep ceiling from any submaximal training set using the Brzycki formula.
              Includes form cues for the Bench Press, Squat, Deadlift, Overhead Press, and Barbell Row.
            </p>

            <div className="tool-formula-box">
              <span className="tool-formula-label">Formula</span>
              <span className="tool-formula-code">Weight × (36 ÷ [37 - Reps])</span>
            </div>

            <div className="tool-chips-row">
              <span className="tool-chip">Brzycki Equation</span>
              <span className="tool-chip">5 Compound Lifts</span>
              <span className="tool-chip">Form Cues</span>
              <span className="tool-chip">1–36 Rep Range</span>
            </div>

            <div className="tool-actions-row">
              <button
                type="button"
                className="btn"
                onClick={() => setSearchParams({ tab: '1rm' })}
              >
                Calculate 1RM →
              </button>
            </div>
          </div>

          {/* Card 3: Macro Calculator */}
          <div className="tool-showcase-card">
            <div className="tool-card-header">
              <div className="tool-badge-wrap">
                <span className="tool-tag">Nutrition & Macros</span>
              </div>
              <div className="tool-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
                </svg>
              </div>
            </div>

            <h3 className="tool-title">Macro Calculator</h3>
            <p className="tool-description">
              Determine your daily caloric ceiling and personalized macronutrient breakdown (Protein, Carbs, Fats)
              calibrated to your body metrics, activity level, and body composition goal.
            </p>

            <div className="tool-formula-box">
              <span className="tool-formula-label">Formula</span>
              <span className="tool-formula-code">Mifflin-St Jeor BMR × TDEE ± Goal</span>
            </div>

            <div className="tool-chips-row">
              <span className="tool-chip">TDEE & BMR</span>
              <span className="tool-chip">Protein / Carbs / Fats</span>
              <span className="tool-chip">4 Diet Splits</span>
              <span className="tool-chip">Per-Meal Targets</span>
            </div>

            <div className="tool-actions-row">
              <button
                type="button"
                className="btn"
                onClick={() => setSearchParams({ tab: 'macro' })}
              >
                Calculate Macros →
              </button>
            </div>
          </div>

          {/* Card 4: Calorie & TDEE Calculator */}
          <div className="tool-showcase-card">
            <div className="tool-card-header">
              <div className="tool-badge-wrap">
                <span className="tool-tag">Energy & TDEE</span>
              </div>
              <div className="tool-icon-box" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c1.5 3 4 5 4 9a6 6 0 0 1-12 0c0-4 2.5-6 4-9 1 2 2 3 4 3s3-1 4-3z" />
                </svg>
              </div>
            </div>

            <h3 className="tool-title">Calorie & TDEE Calculator</h3>
            <p className="tool-description">
              Calculate your exact Total Daily Energy Expenditure (TDEE), resting metabolic rate (BMR),
              and target calorie schedules for fat loss, maintenance, or bulking. Includes 7-day zigzag cycling.
            </p>

            <div className="tool-formula-box">
              <span className="tool-formula-label">Formula</span>
              <span className="tool-formula-code">Mifflin-St Jeor & Katch-McArdle (LBM)</span>
            </div>

            <div className="tool-chips-row">
              <span className="tool-chip">TDEE & BMR</span>
              <span className="tool-chip">6 Goal Tiers</span>
              <span className="tool-chip">Zigzag Schedule</span>
              <span className="tool-chip">Macro Split</span>
            </div>

            <div className="tool-actions-row">
              <button
                type="button"
                className="btn"
                onClick={() => setSearchParams({ tab: 'calorie' })}
              >
                Calculate Calories →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Embedded BMI Calculator */}
      {activeTab === 'bmi' && (
        <div className="tool-embedded-wrapper">
          <div className="card calc-card">
            <div className="tool-embedded-header">
              <h2 className="tool-embedded-title">Body Mass Index (BMI) Calculator</h2>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setSearchParams({})}
              >
                ← Back to Overview
              </button>
            </div>
            <p style={{ marginTop: 0, color: 'var(--color-text-dim)', fontSize: '0.92rem' }}>
              Enter your height in centimeters and weight in kilograms to assess your body composition category.
            </p>

            <form onSubmit={handleBmiCalculate}>
              <div className="calc-form-grid">
                <div>
                  <label htmlFor="bmi-tab-height">Height (cm)</label>
                  <input
                    id="bmi-tab-height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                  />
                </div>

                <div>
                  <label htmlFor="bmi-tab-weight">Weight (kg)</label>
                  <input
                    id="bmi-tab-weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                  />
                </div>
              </div>

              {bmiError && <p className="calc-error">{bmiError}</p>}

              <div className="calc-actions">
                <button type="submit" className="btn">Calculate BMI</button>
                <button type="button" className="btn secondary" onClick={handleBmiReset}>Reset</button>
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

                  {bmiCategory && (
                    <div
                      className="calc-category-badge"
                      style={{ background: bmiCategory.bg, color: bmiCategory.color, border: `1px solid ${bmiCategory.color}40` }}
                    >
                      ● {bmiCategory.label}
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
      )}

      {/* VIEW 3: Embedded 1RM Calculator */}
      {activeTab === '1rm' && (
        <div className="tool-embedded-wrapper">
          <div className="card calc-card">
            <div className="tool-embedded-header">
              <h2 className="tool-embedded-title">One Rep Max (1RM) Calculator</h2>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setSearchParams({})}
              >
                ← Back to Overview
              </button>
            </div>
            <p style={{ marginTop: 0, color: 'var(--color-text-dim)', fontSize: '0.92rem' }}>
              Estimate your maximum single-rep capability from any submaximal lift using the Brzycki formula.
            </p>

            <form onSubmit={handleOrmCalculate}>
              <div className="calc-form-grid">
                <div className="calc-full-width">
                  <label htmlFor="orm-tab-exercise">Exercise</label>
                  <select id="orm-tab-exercise" value={exercise} onChange={(e) => setExercise(e.target.value)}>
                    <option value="bench">Bench Press</option>
                    <option value="squat">Squat</option>
                    <option value="deadlift">Deadlift</option>
                    <option value="overhead">Overhead Press</option>
                    <option value="row">Barbell Row</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="orm-tab-weight">Weight lifted (kg)</label>
                  <input
                    id="orm-tab-weight"
                    type="number"
                    value={ormWeight}
                    onChange={(e) => setOrmWeight(e.target.value)}
                    placeholder="e.g. 80"
                  />
                </div>

                <div>
                  <label htmlFor="orm-tab-reps">Reps performed</label>
                  <input
                    id="orm-tab-reps"
                    type="number"
                    value={ormReps}
                    onChange={(e) => setOrmReps(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              {ormError && <p className="calc-error">{ormError}</p>}

              <div className="calc-actions">
                <button type="submit" className="btn">Calculate 1RM</button>
                <button type="button" className="btn secondary" onClick={handleOrmReset}>Reset</button>
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
      )}

      {/* VIEW 4: Embedded Macro Calculator */}
      {activeTab === 'macro' && (
        <div className="tool-embedded-wrapper tool-macro-wrapper">
          <div className="card calc-card tool-macro-card">
            <div className="tool-embedded-header">
              <h2 className="tool-embedded-title">Macro & Calorie Calculator</h2>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setSearchParams({})}
              >
                ← Back to Overview
              </button>
            </div>
            <p className="tool-macro-subtitle">
              Calculate your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and optimal macronutrient split
              tailored to your training demands and physique goal.
            </p>

            <div className="macro-calculator-layout">
              {/* Left Column: Form Controls */}
              <div className="macro-layout-form-col">
                <form onSubmit={handleMacroCalculate}>
                  {/* Unit System Toggle */}
                  <div className="macro-form-section">
                    <div className="macro-unit-toggle-row">
                      <span className="macro-field-label" style={{ marginBottom: 0 }}>Unit System</span>
                      <div className="macro-unit-pill-group">
                        <button
                          type="button"
                          className={`macro-unit-btn ${unitSystem === 'metric' ? 'active' : ''}`}
                          onClick={() => handleUnitChange('metric')}
                        >
                          Metric (cm, kg)
                        </button>
                        <button
                          type="button"
                          className={`macro-unit-btn ${unitSystem === 'imperial' ? 'active' : ''}`}
                          onClick={() => handleUnitChange('imperial')}
                        >
                          Imperial (ft, lbs)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Biological Sex */}
                  <div className="macro-form-section">
                    <label className="macro-field-label">Biological Sex (for BMR equation)</label>
                    <div className="macro-pill-group macro-sex-pills">
                      <button
                        type="button"
                        className={`macro-pill-btn ${gender === 'male' ? 'active' : ''}`}
                        onClick={() => setGender('male')}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        className={`macro-pill-btn ${gender === 'female' ? 'active' : ''}`}
                        onClick={() => setGender('female')}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Body Measurements - Metric or Imperial */}
                  {unitSystem === 'metric' ? (
                    <div className="macro-measurements-grid">
                      <div>
                        <label htmlFor="macro-age">Age (years)</label>
                        <input
                          id="macro-age"
                          type="number"
                          value={macroAge}
                          onChange={(e) => setMacroAge(e.target.value)}
                          placeholder="e.g. 25"
                          min="12"
                          max="100"
                        />
                      </div>
                      <div>
                        <label htmlFor="macro-height-cm">Height (cm)</label>
                        <input
                          id="macro-height-cm"
                          type="number"
                          value={macroHeightCm}
                          onChange={(e) => setMacroHeightCm(e.target.value)}
                          placeholder="e.g. 178"
                          min="80"
                          max="250"
                        />
                      </div>
                      <div>
                        <label htmlFor="macro-weight-kg">Weight (kg)</label>
                        <input
                          id="macro-weight-kg"
                          type="number"
                          value={macroWeightKg}
                          onChange={(e) => setMacroWeightKg(e.target.value)}
                          placeholder="e.g. 75"
                          min="25"
                          max="300"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="macro-measurements-grid macro-imperial-grid">
                      <div>
                        <label htmlFor="macro-age-imp">Age (years)</label>
                        <input
                          id="macro-age-imp"
                          type="number"
                          value={macroAge}
                          onChange={(e) => setMacroAge(e.target.value)}
                          placeholder="e.g. 25"
                          min="12"
                          max="100"
                        />
                      </div>
                      <div>
                        <label>Height (ft / in)</label>
                        <div className="macro-split-inputs">
                          <input
                            id="macro-height-ft"
                            type="number"
                            value={macroHeightFt}
                            onChange={(e) => setMacroHeightFt(e.target.value)}
                            placeholder="5"
                            min="3"
                            max="8"
                            aria-label="Height feet"
                          />
                          <input
                            id="macro-height-in"
                            type="number"
                            value={macroHeightIn}
                            onChange={(e) => setMacroHeightIn(e.target.value)}
                            placeholder="10"
                            min="0"
                            max="11"
                            aria-label="Height inches"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="macro-weight-lbs">Weight (lbs)</label>
                        <input
                          id="macro-weight-lbs"
                          type="number"
                          value={macroWeightLbs}
                          onChange={(e) => setMacroWeightLbs(e.target.value)}
                          placeholder="e.g. 165"
                          min="55"
                          max="660"
                        />
                      </div>
                    </div>
                  )}

                  {/* Activity Level */}
                  <div className="macro-form-section">
                    <label htmlFor="macro-activity" className="macro-field-label">Daily Activity Level</label>
                    <select
                      id="macro-activity"
                      value={activity}
                      onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                    >
                      {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label} — {item.desc} (×{item.multiplier})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Goal */}
                  <div className="macro-form-section">
                    <label className="macro-field-label">Physique & Performance Goal</label>
                    <div className="macro-pill-group macro-goal-pills">
                      {Object.entries(GOAL_ADJUSTMENTS).map(([key, item]) => (
                        <button
                          key={key}
                          type="button"
                          className={`macro-pill-btn ${goal === key ? 'active' : ''}`}
                          onClick={() => setGoal(key as FitnessGoal)}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diet Split */}
                  <div className="macro-form-section">
                    <label className="macro-field-label">Macronutrient Distribution</label>
                    <div className="macro-pill-group macro-split-pills">
                      {Object.entries(DIET_SPLITS).map(([key, item]) => (
                        <button
                          key={key}
                          type="button"
                          className={`macro-pill-btn ${split === key ? 'active' : ''}`}
                          onClick={() => setSplit(key as DietSplit)}
                        >
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meals Per Day */}
                  <div className="macro-form-section">
                    <label className="macro-field-label">Daily Meals Distribution</label>
                    <div className="macro-pill-group macro-meal-pills">
                      {[3, 4, 5, 6].map((m) => (
                        <button
                          key={m}
                          type="button"
                          className={`macro-pill-btn ${meals === m ? 'active' : ''}`}
                          onClick={() => setMeals(m)}
                        >
                          {m} Meals
                        </button>
                      ))}
                    </div>
                  </div>

                  {macroError && <p className="calc-error">{macroError}</p>}

                  <div className="calc-actions">
                    <button type="submit" className="btn">Calculate Macros</button>
                    <button type="button" className="btn secondary" onClick={handleMacroReset}>Reset</button>
                  </div>
                </form>
              </div>

              {/* Right Column: Output Results Panel */}
              <div className="macro-layout-results-col">
                {macroResult !== null ? (
                  <div className="macro-results-wrap">
                    {/* Hero Target Calories */}
                    <div className={`macro-calorie-hero-card ${pulseCalc ? 'macro-calc-pulse' : ''}`}>
                      <div>
                        <div className="stat-label">Daily Target Calories</div>
                        <div className="macro-calorie-val-wrap">
                          <span className="macro-calorie-num">{macroResult.targetCalories.toLocaleString()}</span>
                          <span className="macro-calorie-unit">kcal / day</span>
                        </div>
                      </div>
                      <div>
                        <span className="macro-goal-badge">{GOAL_ADJUSTMENTS[goal].label}</span>
                      </div>
                    </div>

                    {macroResult.targetCalories === 0 && (
                      <div className="macro-zero-hint">
                        <span>💡 Enter your age, height, and weight to calculate your personalized daily macronutrients.</span>
                      </div>
                    )}

                    {/* Macro Proportion Track */}
                    <div className="macro-bar-container">
                      <div className="macro-bar-labels">
                        <span style={{ color: 'var(--color-accent)' }}>
                          Protein {macroResult.targetCalories > 0 ? macroResult.proteinPct : 0}%
                        </span>
                        <span style={{ color: 'var(--color-accent-2)' }}>
                          Carbs {macroResult.targetCalories > 0 ? macroResult.carbPct : 0}%
                        </span>
                        <span style={{ color: '#FBBF24' }}>
                          Fats {macroResult.targetCalories > 0 ? macroResult.fatPct : 0}%
                        </span>
                      </div>
                      <div className="macro-bar-track">
                        <div
                          className="macro-bar-seg protein"
                          style={{ width: `${macroResult.targetCalories > 0 ? macroResult.proteinPct : 0}%` }}
                        />
                        <div
                          className="macro-bar-seg carbs"
                          style={{ width: `${macroResult.targetCalories > 0 ? macroResult.carbPct : 0}%` }}
                        />
                        <div
                          className="macro-bar-seg fats"
                          style={{ width: `${macroResult.targetCalories > 0 ? macroResult.fatPct : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* 3 Macro Cards */}
                    <div className="macro-cards-grid">
                      <div className="macro-card protein">
                        <div className="macro-card-header">
                          <span className="macro-card-title">Protein</span>
                          <span className="macro-card-pct">{macroResult.targetCalories > 0 ? macroResult.proteinPct : 0}%</span>
                        </div>
                        <div className="macro-card-grams">{macroResult.proteinGrams}g</div>
                        <div className="macro-card-cals">{macroResult.proteinCals} kcal · 4 kcal/g</div>
                        <div className="macro-card-meal-target">
                          ~{macroResult.perMeal.protein}g per meal ({meals} meals)
                        </div>
                      </div>

                      <div className="macro-card carbs">
                        <div className="macro-card-header">
                          <span className="macro-card-title">Carbohydrates</span>
                          <span className="macro-card-pct">{macroResult.carbPct}%</span>
                        </div>
                        <div className="macro-card-grams">{macroResult.carbGrams}g</div>
                        <div className="macro-card-cals">{macroResult.carbCals} kcal · 4 kcal/g</div>
                        <div className="macro-card-meal-target">
                          ~{macroResult.perMeal.carbs}g per meal ({meals} meals)
                        </div>
                      </div>

                      <div className="macro-card fats">
                        <div className="macro-card-header">
                          <span className="macro-card-title">Dietary Fats</span>
                          <span className="macro-card-pct">{macroResult.fatPct}%</span>
                        </div>
                        <div className="macro-card-grams">{macroResult.fatGrams}g</div>
                        <div className="macro-card-cals">{macroResult.fatCals} kcal · 9 kcal/g</div>
                        <div className="macro-card-meal-target">
                          ~{macroResult.perMeal.fat}g per meal ({meals} meals)
                        </div>
                      </div>
                    </div>

                    {/* Details Subgrid: BMR/TDEE & Per Meal Blueprint Side-by-Side */}
                    <div className="macro-results-details-grid">
                      {/* Meta Card: BMR, TDEE, Calorie Delta */}
                      <div className="macro-meta-strip-card">
                        <div className="macro-detail-card-title">Metabolic Baseline</div>
                        <div className="macro-meta-items">
                          <div className="macro-meta-item">
                            <span className="macro-meta-label">Basal Metabolic Rate (BMR)</span>
                            <span className="macro-meta-value">{macroResult.bmr.toLocaleString()} kcal</span>
                          </div>
                          <div className="macro-meta-item">
                            <span className="macro-meta-label">Maintenance (TDEE)</span>
                            <span className="macro-meta-value">{macroResult.tdee.toLocaleString()} kcal</span>
                          </div>
                          <div className="macro-meta-item">
                            <span className="macro-meta-label">Goal Calorie Delta</span>
                            <span className="macro-meta-value">
                              {macroResult.targetCalories === 0
                                ? '0 kcal'
                                : macroResult.targetCalories - macroResult.tdee > 0
                                ? `+${(macroResult.targetCalories - macroResult.tdee).toLocaleString()} kcal`
                                : macroResult.targetCalories - macroResult.tdee === 0
                                ? '0 kcal'
                                : `${(macroResult.targetCalories - macroResult.tdee).toLocaleString()} kcal`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Per Meal Summary */}
                      <div className="macro-meal-summary-card">
                        <div className="macro-detail-card-title">
                          Per Meal Blueprint ({meals} daily meals)
                        </div>
                        <div className="macro-meal-items-grid">
                          <div className="macro-meal-stat-box">
                            <span className="macro-meal-stat-icon">🔥</span>
                            <div>
                              <div className="macro-meal-stat-val">{macroResult.perMeal.calories} kcal</div>
                              <div className="macro-meal-stat-lbl">Calories / Meal</div>
                            </div>
                          </div>
                          <div className="macro-meal-stat-box">
                            <span className="macro-meal-stat-icon">🥩</span>
                            <div>
                              <div className="macro-meal-stat-val">{macroResult.perMeal.protein}g</div>
                              <div className="macro-meal-stat-lbl">Protein / Meal</div>
                            </div>
                          </div>
                          <div className="macro-meal-stat-box">
                            <span className="macro-meal-stat-icon">🍚</span>
                            <div>
                              <div className="macro-meal-stat-val">{macroResult.perMeal.carbs}g</div>
                              <div className="macro-meal-stat-lbl">Carbs / Meal</div>
                            </div>
                          </div>
                          <div className="macro-meal-stat-box">
                            <span className="macro-meal-stat-icon">🥑</span>
                            <div>
                              <div className="macro-meal-stat-val">{macroResult.perMeal.fat}g</div>
                              <div className="macro-meal-stat-lbl">Fats / Meal</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Goal Guidance Tip */}
                    <div className="macro-coaching-card">
                      <div className="macro-coaching-title">Coaching Protocol · {GOAL_ADJUSTMENTS[goal].label}</div>
                      <div>{GOAL_ADJUSTMENTS[goal].tip}</div>
                    </div>
                  </div>
                ) : (
                  <div className="macro-placeholder-card">
                    <div className="macro-placeholder-icon" aria-hidden="true">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a10 10 0 0 1 10 10H12V2z" />
                      </svg>
                    </div>
                    <h3 className="macro-placeholder-title">Ready to Calculate</h3>
                    <p className="macro-placeholder-desc">
                      Configure your biological metrics, daily activity level, and physique goal on the left, then click <strong>Calculate Macros</strong> to generate your precision daily calorie ceiling, macronutrient distribution, and meal targets.
                    </p>
                    <div className="macro-placeholder-checklist">
                      <div className="macro-checklist-item">
                        <span className="macro-check-dot protein" />
                        <span>Mifflin-St Jeor Basal Metabolic Rate (BMR)</span>
                      </div>
                      <div className="macro-checklist-item">
                        <span className="macro-check-dot carbs" />
                        <span>Total Daily Energy Expenditure (TDEE)</span>
                      </div>
                      <div className="macro-checklist-item">
                        <span className="macro-check-dot fats" />
                        <span>Calibrated Protein, Carbs, and Fats splits</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: Embedded Calorie Calculator */}
      {activeTab === 'calorie' && (
        <CalorieCalculator onBack={() => setSearchParams({})} />
      )}
    </div>
  )
}

export default Tools