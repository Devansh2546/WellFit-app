import React, { useState, useEffect } from 'react'

// --- Types & Constants ---
export type CalorieUnitSystem = 'metric' | 'imperial'
export type CalorieGender = 'male' | 'female'
export type CalorieActivity = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
export type CalorieGoalKey = 'maintain' | 'mild_loss' | 'loss' | 'extreme_loss' | 'mild_gain' | 'gain'
export type CalorieFormula = 'mifflin' | 'katch'
export type CalorieDietSplit = 'balanced' | 'high_protein' | 'low_carb' | 'keto'

export interface CalorieGoalDefinition {
  key: CalorieGoalKey
  label: string
  shortName: string
  delta: number // kcal delta per day
  weeklyChangeKg: number // approximate kg/wk
  weeklyChangeLbs: number // approximate lbs/wk
  tag: string
  color: string
  desc: string
}

export const CALORIE_GOALS: CalorieGoalDefinition[] = [
  {
    key: 'maintain',
    label: 'Maintain Weight',
    shortName: 'Maintain',
    delta: 0,
    weeklyChangeKg: 0,
    weeklyChangeLbs: 0,
    tag: '100% TDEE',
    color: 'var(--color-accent)',
    desc: 'Energy equilibrium. Fuel athletic recovery, build baseline strength, and preserve lean tissue.'
  },
  {
    key: 'mild_loss',
    label: 'Mild Weight Loss',
    shortName: 'Mild Deficit',
    delta: -250,
    weeklyChangeKg: -0.25,
    weeklyChangeLbs: -0.5,
    tag: '-250 kcal/day',
    color: '#38bdf8',
    desc: 'Sustainable 10% deficit. Best for long-term body recomposition with minimal hunger.'
  },
  {
    key: 'loss',
    label: 'Standard Weight Loss',
    shortName: 'Fat Loss',
    delta: -500,
    weeklyChangeKg: -0.5,
    weeklyChangeLbs: -1.0,
    tag: '-500 kcal/day',
    color: '#f59e0b',
    desc: 'Standard 20% athletic deficit. Reliable ~0.5 kg (1 lb) per week fat loss pace.'
  },
  {
    key: 'extreme_loss',
    label: 'Aggressive Weight Loss',
    shortName: 'Fast Cut',
    delta: -1000,
    weeklyChangeKg: -1.0,
    weeklyChangeLbs: -2.0,
    tag: '-1,000 kcal/day',
    color: '#ef4444',
    desc: 'Aggressive deficit for rapid cutting. Keep protein high to prevent muscle catabolism.'
  },
  {
    key: 'mild_gain',
    label: 'Mild Muscle Gain',
    shortName: 'Lean Bulk',
    delta: 250,
    weeklyChangeKg: 0.25,
    weeklyChangeLbs: 0.5,
    tag: '+250 kcal/day',
    color: '#10b981',
    desc: 'Lean caloric surplus. Maximizes hypertrophy while keeping unwanted adiposity to a minimum.'
  },
  {
    key: 'gain',
    label: 'Hypertrophy Surplus',
    shortName: 'Full Bulk',
    delta: 500,
    weeklyChangeKg: 0.5,
    weeklyChangeLbs: 1.0,
    tag: '+500 kcal/day',
    color: '#8b5cf6',
    desc: 'Classic bodybuilding surplus for hardgainers and high-volume hypertrophy blocks.'
  }
]

export const CALORIE_ACTIVITIES: Record<CalorieActivity, { multiplier: number; label: string; desc: string; icon: string }> = {
  sedentary: {
    multiplier: 1.2,
    label: 'Sedentary',
    desc: 'Desk job, little to no formal exercise',
    icon: '🛋️'
  },
  light: {
    multiplier: 1.375,
    label: 'Lightly Active',
    desc: 'Light workouts / walking 1–3 days/wk',
    icon: '🚶'
  },
  moderate: {
    multiplier: 1.55,
    label: 'Moderately Active',
    desc: 'Gym training / sports 3–5 days/wk',
    icon: '🏋️'
  },
  very: {
    multiplier: 1.725,
    label: 'Very Active',
    desc: 'Hard daily training / sports 6–7 days/wk',
    icon: '⚡'
  },
  extra: {
    multiplier: 1.9,
    label: 'Extra Active',
    desc: 'Intense daily training & physical labor',
    icon: '🔥'
  }
}

export const CALORIE_MACRO_SPLITS: Record<CalorieDietSplit, { name: string; p: number; c: number; f: number; desc: string }> = {
  balanced: { name: 'Balanced', p: 0.30, c: 0.40, f: 0.30, desc: '30% Protein · 40% Carbs · 30% Fat' },
  high_protein: { name: 'High Protein', p: 0.40, c: 0.35, f: 0.25, desc: '40% Protein · 35% Carbs · 25% Fat' },
  low_carb: { name: 'Low Carb', p: 0.40, c: 0.20, f: 0.40, desc: '40% Protein · 20% Carbs · 40% Fat' },
  keto: { name: 'Keto', p: 0.25, c: 0.05, f: 0.70, desc: '25% Protein · 5% Carbs · 70% Fat' }
}

interface Props {
  onBack?: () => void
}

export const CalorieCalculator: React.FC<Props> = ({ onBack }) => {
  // Input states
  const [unitSystem, setUnitSystem] = useState<CalorieUnitSystem>('metric')
  const [gender, setGender] = useState<CalorieGender>('male')
  const [age, setAge] = useState<string>('')
  
  // Metric
  const [heightCm, setHeightCm] = useState<string>('')
  const [weightKg, setWeightKg] = useState<string>('')
  
  // Imperial
  const [heightFt, setHeightFt] = useState<string>('')
  const [heightIn, setHeightIn] = useState<string>('')
  const [weightLbs, setWeightLbs] = useState<string>('')

  // Body Fat % (Optional MuscleWiki feature)
  const [bodyFat, setBodyFat] = useState<string>('')
  const [formulaChoice, setFormulaChoice] = useState<CalorieFormula>('mifflin')

  // Activity & Goal
  const [activity, setActivity] = useState<CalorieActivity>('moderate')
  const [selectedGoal, setSelectedGoal] = useState<CalorieGoalKey>('maintain')

  // Zigzag Schedule Toggle
  const [isZigzag, setIsZigzag] = useState<boolean>(false)
  const [workoutDays, setWorkoutDays] = useState<number>(4)

  // Macro Preview Split
  const [macroSplit, setMacroSplit] = useState<CalorieDietSplit>('high_protein')

  // Calculation Results
  const [bmr, setBmr] = useState<number>(0)
  const [tdee, setTdee] = useState<number>(0)
  const [targetCalories, setTargetCalories] = useState<number>(0)
  const [activeFormulaUsed, setActiveFormulaUsed] = useState<string>('Mifflin-St Jeor')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pulseCalc, setPulseCalc] = useState<boolean>(false)

  // Unit conversion
  const handleUnitToggle = (newUnit: CalorieUnitSystem) => {
    if (newUnit === unitSystem) return
    setUnitSystem(newUnit)

    if (newUnit === 'imperial') {
      if (heightCm.trim()) {
        const cm = parseFloat(heightCm)
        if (!isNaN(cm) && cm > 0) {
          const totalInches = cm / 2.54
          setHeightFt(String(Math.floor(totalInches / 12)))
          setHeightIn(String(Math.round(totalInches % 12)))
        }
      } else {
        setHeightFt('')
        setHeightIn('')
      }
      if (weightKg.trim()) {
        const kg = parseFloat(weightKg)
        if (!isNaN(kg) && kg > 0) {
          setWeightLbs(String(Math.round(kg * 2.20462)))
        }
      } else {
        setWeightLbs('')
      }
    } else {
      if (heightFt.trim() || heightIn.trim()) {
        const ft = parseFloat(heightFt) || 0
        const inch = parseFloat(heightIn) || 0
        if (ft > 0 || inch > 0) {
          setHeightCm(String(Math.round((ft * 12 + inch) * 2.54)))
        }
      } else {
        setHeightCm('')
      }
      if (weightLbs.trim()) {
        const lbs = parseFloat(weightLbs)
        if (!isNaN(lbs) && lbs > 0) {
          setWeightKg(String(Math.round((lbs / 2.20462) * 10) / 10))
        }
      } else {
        setWeightKg('')
      }
    }
  }

  // Resolve normalized metric values
  const getNormalizedMetrics = () => {
    const parsedAge = parseFloat(age)
    let parsedHeight = 0
    let parsedWeight = 0

    if (unitSystem === 'metric') {
      parsedHeight = parseFloat(heightCm)
      parsedWeight = parseFloat(weightKg)
    } else {
      const ft = parseFloat(heightFt) || 0
      const inch = parseFloat(heightIn) || 0
      const lbs = parseFloat(weightLbs) || 0
      parsedHeight = (ft * 12 + inch) * 2.54
      parsedWeight = lbs / 2.20462
    }

    const parsedBf = parseFloat(bodyFat)
    return {
      parsedAge,
      parsedHeight,
      parsedWeight,
      parsedBf: !isNaN(parsedBf) && parsedBf >= 3 && parsedBf <= 65 ? parsedBf : null
    }
  }

  const isValidInput = (a: number, h: number, w: number) => {
    return (
      !isNaN(a) && !isNaN(h) && !isNaN(w) &&
      a >= 10 && a <= 110 &&
      h >= 80 && h <= 260 &&
      w >= 25 && w <= 350
    )
  }

  // Recalculate logic
  useEffect(() => {
    const { parsedAge, parsedHeight, parsedWeight, parsedBf } = getNormalizedMetrics()

    if (!isValidInput(parsedAge, parsedHeight, parsedWeight)) {
      setBmr(0)
      setTdee(0)
      setTargetCalories(0)
      return
    }

    setErrorMessage(null)

    // Determine BMR equation
    let calculatedBmr = 0
    let formulaName = 'Mifflin-St Jeor'

    if (parsedBf !== null && formulaChoice === 'katch') {
      // Katch-McArdle: BMR = 370 + (21.6 * Lean Body Mass in kg)
      const lbm = parsedWeight * (1 - parsedBf / 100)
      calculatedBmr = 370 + (21.6 * lbm)
      formulaName = 'Katch-McArdle (LBM)'
    } else {
      // Mifflin-St Jeor
      if (gender === 'male') {
        calculatedBmr = (10 * parsedWeight) + (6.25 * parsedHeight) - (5 * parsedAge) + 5
      } else {
        calculatedBmr = (10 * parsedWeight) + (6.25 * parsedHeight) - (5 * parsedAge) - 161
      }
      formulaName = 'Mifflin-St Jeor'
    }

    const activityMult = CALORIE_ACTIVITIES[activity].multiplier
    const calculatedTdee = calculatedBmr * activityMult

    const goalDef = CALORIE_GOALS.find(g => g.key === selectedGoal) || CALORIE_GOALS[0]
    const calculatedTarget = Math.max(800, Math.round(calculatedTdee + goalDef.delta))

    setBmr(Math.round(calculatedBmr))
    setTdee(Math.round(calculatedTdee))
    setTargetCalories(calculatedTarget)
    setActiveFormulaUsed(formulaName)
  }, [
    unitSystem,
    gender,
    age,
    heightCm,
    weightKg,
    heightFt,
    heightIn,
    weightLbs,
    bodyFat,
    formulaChoice,
    activity,
    selectedGoal
  ])

  const handleManualCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const { parsedAge, parsedHeight, parsedWeight } = getNormalizedMetrics()

    if (!isValidInput(parsedAge, parsedHeight, parsedWeight)) {
      setErrorMessage('Please enter valid age (10-110), height, and weight to calculate.')
      return
    }

    setPulseCalc(true)
    setTimeout(() => setPulseCalc(false), 600)
  }

  const handleReset = () => {
    setAge('')
    setHeightCm('')
    setWeightKg('')
    setHeightFt('')
    setHeightIn('')
    setWeightLbs('')
    setBodyFat('')
    setBmr(0)
    setTdee(0)
    setTargetCalories(0)
    setErrorMessage(null)
    setSelectedGoal('maintain')
    setIsZigzag(false)
  }

  // Active goal object
  const currentGoalDef = CALORIE_GOALS.find(g => g.key === selectedGoal) || CALORIE_GOALS[0]

  // Calculate Zigzag 7-Day breakdown
  // Weekly total must match targetCalories * 7
  const weeklyTotalCals = targetCalories * 7
  const trainingDayCals = targetCalories > 0 ? Math.round(targetCalories * 1.10) : 0 // +10% on training days
  const restDayCals = targetCalories > 0
    ? Math.max(800, Math.round((weeklyTotalCals - (trainingDayCals * workoutDays)) / (7 - workoutDays)))
    : 0

  const daysOfWeek = [
    { day: 'Mon', isWorkout: workoutDays >= 1 },
    { day: 'Tue', isWorkout: workoutDays >= 2 },
    { day: 'Wed', isWorkout: false },
    { day: 'Thu', isWorkout: workoutDays >= 3 },
    { day: 'Fri', isWorkout: workoutDays >= 4 },
    { day: 'Sat', isWorkout: workoutDays >= 5 },
    { day: 'Sun', isWorkout: false },
  ]

  // Macro distribution for current target calories
  const splitConfig = CALORIE_MACRO_SPLITS[macroSplit]
  const proteinCals = targetCalories > 0 ? Math.round(targetCalories * splitConfig.p) : 0
  const carbCals = targetCalories > 0 ? Math.round(targetCalories * splitConfig.c) : 0
  const fatCals = targetCalories > 0 ? Math.max(0, targetCalories - proteinCals - carbCals) : 0

  const proteinGrams = Math.round(proteinCals / 4)
  const carbGrams = Math.round(carbCals / 4)
  const fatGrams = Math.round(fatCals / 9)

  // Clinical safety warning for low calories
  const minSafeFloor = gender === 'male' ? 1500 : 1200
  const isBelowSafeFloor = targetCalories > 0 && targetCalories < minSafeFloor

  return (
    <div className="tool-embedded-wrapper tool-calorie-wrapper">
      <div className="card calc-card tool-calorie-card">
        {/* Header Bar */}
        <div className="tool-embedded-header">
          <div>
            <div className="calorie-header-tag-row">
              <span className="calorie-badge">CALORIE & TDEE ENGINE</span>
              <span className="calorie-formula-chip">Formula: {activeFormulaUsed}</span>
            </div>
            <h2 className="tool-embedded-title">Calorie & TDEE Calculator</h2>
          </div>
          {onBack && (
            <button
              type="button"
              className="btn secondary"
              style={{ padding: '7px 16px', fontSize: '0.84rem' }}
              onClick={onBack}
            >
              ← Back to Overview
            </button>
          )}
        </div>

        <p className="tool-calorie-subtitle">
          Calculate your Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), and multi-tier
          calorie targets tailored to fat loss, recomp, or lean hypertrophy.
        </p>

        {/* 50/50 Balanced Grid Layout */}
        <div className="calorie-calculator-layout">
          {/* ================= LEFT COLUMN: FORM CONTROLS ================= */}
          <div className="calorie-layout-form-col">
            <form onSubmit={handleManualCalculate}>
              {/* Unit System Toggle */}
              <div className="calorie-form-section">
                <div className="calorie-unit-toggle-row">
                  <span className="calorie-field-label">Unit System</span>
                  <div className="calorie-unit-pill-group">
                    <button
                      type="button"
                      className={`calorie-unit-btn ${unitSystem === 'metric' ? 'active' : ''}`}
                      onClick={() => handleUnitToggle('metric')}
                    >
                      Metric (cm, kg)
                    </button>
                    <button
                      type="button"
                      className={`calorie-unit-btn ${unitSystem === 'imperial' ? 'active' : ''}`}
                      onClick={() => handleUnitToggle('imperial')}
                    >
                      Imperial (ft, lbs)
                    </button>
                  </div>
                </div>
              </div>

              {/* Biological Sex */}
              <div className="calorie-form-section">
                <label className="calorie-field-label">Biological Sex</label>
                <div className="calorie-pill-group calorie-sex-pills">
                  <button
                    type="button"
                    className={`calorie-pill-btn ${gender === 'male' ? 'active' : ''}`}
                    onClick={() => setGender('male')}
                  >
                    <span>♂ Male</span>
                  </button>
                  <button
                    type="button"
                    className={`calorie-pill-btn ${gender === 'female' ? 'active' : ''}`}
                    onClick={() => setGender('female')}
                  >
                    <span>♀ Female</span>
                  </button>
                </div>
              </div>

              {/* Age, Height, Weight Grid */}
              <div className="calorie-form-section">
                <div className="calc-inputs-grid calorie-inputs-grid">
                  <div>
                    <label htmlFor="cal-age">Age</label>
                    <div className="input-with-suffix">
                      <input
                        id="cal-age"
                        type="number"
                        min="10"
                        max="110"
                        placeholder="e.g. 25"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <span className="input-suffix">yrs</span>
                    </div>
                  </div>

                  {unitSystem === 'metric' ? (
                    <>
                      <div>
                        <label htmlFor="cal-height-cm">Height</label>
                        <div className="input-with-suffix">
                          <input
                            id="cal-height-cm"
                            type="number"
                            min="80"
                            max="260"
                            placeholder="e.g. 178"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                          />
                          <span className="input-suffix">cm</span>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cal-weight-kg">Weight</label>
                        <div className="input-with-suffix">
                          <input
                            id="cal-weight-kg"
                            type="number"
                            step="0.1"
                            min="25"
                            max="350"
                            placeholder="e.g. 75"
                            value={weightKg}
                            onChange={(e) => setWeightKg(e.target.value)}
                          />
                          <span className="input-suffix">kg</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label>Height (ft & in)</label>
                        <div className="calorie-dual-inputs">
                          <div className="input-with-suffix">
                            <input
                              type="number"
                              min="2"
                              max="8"
                              placeholder="5"
                              value={heightFt}
                              onChange={(e) => setHeightFt(e.target.value)}
                            />
                            <span className="input-suffix">ft</span>
                          </div>
                          <div className="input-with-suffix">
                            <input
                              type="number"
                              min="0"
                              max="11"
                              placeholder="10"
                              value={heightIn}
                              onChange={(e) => setHeightIn(e.target.value)}
                            />
                            <span className="input-suffix">in</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cal-weight-lbs">Weight</label>
                        <div className="input-with-suffix">
                          <input
                            id="cal-weight-lbs"
                            type="number"
                            min="50"
                            max="750"
                            placeholder="e.g. 165"
                            value={weightLbs}
                            onChange={(e) => setWeightLbs(e.target.value)}
                          />
                          <span className="input-suffix">lbs</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Optional Body Fat % & Formula Choice (MuscleWiki reference) */}
              <div className="calorie-form-section calorie-optional-box">
                <div className="calorie-optional-header">
                  <div>
                    <label htmlFor="cal-bodyfat" className="calorie-field-label" style={{ marginBottom: 2 }}>
                      Body Fat % <span className="calorie-optional-tag">(Optional)</span>
                    </label>
                    <span className="calorie-optional-sub">Enables lean body mass (Katch-McArdle) formula</span>
                  </div>
                  <div className="input-with-suffix" style={{ width: '110px' }}>
                    <input
                      id="cal-bodyfat"
                      type="number"
                      step="0.5"
                      min="3"
                      max="65"
                      placeholder="e.g. 15"
                      value={bodyFat}
                      onChange={(e) => {
                        setBodyFat(e.target.value)
                        if (e.target.value.trim() && parseFloat(e.target.value) > 0) {
                          setFormulaChoice('katch')
                        } else {
                          setFormulaChoice('mifflin')
                        }
                      }}
                    />
                    <span className="input-suffix">%</span>
                  </div>
                </div>

                {bodyFat.trim() && !isNaN(parseFloat(bodyFat)) && (
                  <div className="calorie-formula-toggle-row">
                    <span className="calorie-sublabel">Formula Engine:</span>
                    <div className="calorie-formula-pills">
                      <button
                        type="button"
                        className={`calorie-formula-btn ${formulaChoice === 'katch' ? 'active' : ''}`}
                        onClick={() => setFormulaChoice('katch')}
                      >
                        Katch-McArdle (LBM)
                      </button>
                      <button
                        type="button"
                        className={`calorie-formula-btn ${formulaChoice === 'mifflin' ? 'active' : ''}`}
                        onClick={() => setFormulaChoice('mifflin')}
                      >
                        Mifflin-St Jeor
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Level Picker */}
              <div className="calorie-form-section">
                <label className="calorie-field-label">Daily Activity & Training Intensity</label>
                <div className="calorie-activity-stack">
                  {(Object.keys(CALORIE_ACTIVITIES) as CalorieActivity[]).map((actKey) => {
                    const item = CALORIE_ACTIVITIES[actKey]
                    const isSelected = activity === actKey
                    return (
                      <button
                        key={actKey}
                        type="button"
                        className={`calorie-activity-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setActivity(actKey)}
                      >
                        <span className="calorie-activity-icon" aria-hidden="true">{item.icon}</span>
                        <div className="calorie-activity-text">
                          <div className="calorie-activity-title-row">
                            <span className="calorie-activity-name">{item.label}</span>
                            <span className="calorie-activity-factor">×{item.multiplier}</span>
                          </div>
                          <div className="calorie-activity-desc">{item.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Calorie Cycling / Zigzag Toggle (MuscleWiki feature) */}
              <div className="calorie-form-section calorie-zigzag-toggle-box">
                <div className="calorie-zigzag-row">
                  <div>
                    <span className="calorie-field-label" style={{ marginBottom: 2 }}>
                      Zigzag Calorie Cycling
                    </span>
                    <span className="calorie-optional-sub">Higher intake on workout days, lower on rest days</span>
                  </div>
                  <button
                    type="button"
                    className={`calorie-switch-btn ${isZigzag ? 'on' : 'off'}`}
                    onClick={() => setIsZigzag(!isZigzag)}
                    aria-label="Toggle Zigzag Calorie Cycling"
                  >
                    <span className="calorie-switch-knob" />
                  </button>
                </div>

                {isZigzag && (
                  <div className="calorie-zigzag-options">
                    <span className="calorie-sublabel">Workout Days Per Week:</span>
                    <div className="calorie-days-picker">
                      {[3, 4, 5].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`calorie-day-pill ${workoutDays === d ? 'active' : ''}`}
                          onClick={() => setWorkoutDays(d)}
                        >
                          {d} Days / Wk
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && <p className="calc-error">{errorMessage}</p>}

              {/* Actions */}
              <div className="calc-actions calorie-form-actions">
                <button type="submit" className={`btn ${pulseCalc ? 'pulse' : ''}`}>
                  Calculate Daily Calories
                </button>
                <button type="button" className="btn secondary" onClick={handleReset}>
                  Reset All
                </button>
              </div>
            </form>
          </div>

          {/* ================= RIGHT COLUMN: OUTPUTS & VISUALIZATIONS ================= */}
          <div className="calorie-layout-results-col">
            {/* 1. Primary Hero Result Card */}
            <div className="calorie-hero-card">
              <div className="calorie-hero-top">
                <div className="calorie-hero-title-group">
                  <span className="calorie-hero-eyebrow">YOUR DAILY CALORIC TARGET</span>
                  <div className="calorie-hero-value-wrap">
                    <span className="calorie-hero-number">{targetCalories.toLocaleString()}</span>
                    <span className="calorie-hero-unit">kcal / day</span>
                  </div>
                  <div className="calorie-hero-goal-tag" style={{ borderColor: currentGoalDef.color }}>
                    <span className="calorie-dot" style={{ backgroundColor: currentGoalDef.color }} />
                    <strong>{currentGoalDef.label}</strong>
                    <span>({currentGoalDef.tag})</span>
                  </div>
                </div>

                {/* Secondary Baselines: BMR & Maintenance TDEE */}
                <div className="calorie-baselines-col">
                  <div className="calorie-baseline-pill">
                    <span className="baseline-label">Maintenance (TDEE)</span>
                    <span className="baseline-value">{tdee.toLocaleString()} <small>kcal</small></span>
                  </div>
                  <div className="calorie-baseline-pill">
                    <span className="baseline-label">Resting BMR</span>
                    <span className="baseline-value">{bmr.toLocaleString()} <small>kcal</small></span>
                  </div>
                </div>
              </div>

              {/* Clinical safety alert if below safe baseline */}
              {isBelowSafeFloor && (
                <div className="calorie-safety-alert">
                  <span className="safety-alert-icon">⚠️</span>
                  <span>
                    <strong>Clinical Notice:</strong> Target intake is below {minSafeFloor} kcal/day. 
                    Very low calorie diets require medical supervision to prevent micronutrient deficiency and metabolic slowdown.
                  </span>
                </div>
              )}
            </div>

            {/* 2. Interactive Multi-Goal Comparative Matrix (MuscleWiki Style) */}
            <div className="calorie-card-box">
              <div className="calorie-box-header">
                <div>
                  <h3 className="calorie-box-title">Target Goal Comparison Matrix</h3>
                  <p className="calorie-box-desc">Select any tier below to instantly adapt your targets</p>
                </div>
              </div>

              <div className="calorie-goals-grid">
                {CALORIE_GOALS.map((goalItem) => {
                  const isSelected = selectedGoal === goalItem.key
                  const goalCals = tdee > 0 ? Math.max(800, Math.round(tdee + goalItem.delta)) : 0
                  const weeklyDisplay = unitSystem === 'metric'
                    ? `${goalItem.weeklyChangeKg > 0 ? '+' : ''}${goalItem.weeklyChangeKg} kg/wk`
                    : `${goalItem.weeklyChangeLbs > 0 ? '+' : ''}${goalItem.weeklyChangeLbs} lbs/wk`

                  return (
                    <button
                      key={goalItem.key}
                      type="button"
                      className={`calorie-goal-tile ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedGoal(goalItem.key)}
                    >
                      <div className="calorie-goal-tile-header">
                        <span className="calorie-goal-tile-name">{goalItem.shortName}</span>
                        <span
                          className="calorie-goal-tile-badge"
                          style={{
                            color: goalItem.color,
                            backgroundColor: `${goalItem.color}1a`,
                            borderColor: `${goalItem.color}33`
                          }}
                        >
                          {goalItem.delta === 0 ? '±0' : `${goalItem.delta > 0 ? '+' : ''}${goalItem.delta}`}
                        </span>
                      </div>

                      <div className="calorie-goal-tile-cals">
                        <span className="calorie-tile-num">{goalCals.toLocaleString()}</span>
                        <span className="calorie-tile-unit">kcal</span>
                      </div>

                      <div className="calorie-goal-tile-pace">
                        {goalItem.delta === 0 ? 'Maintain weight' : weeklyDisplay}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Zigzag 7-Day Calorie Cycling Schedule (If Enabled) */}
            {isZigzag && targetCalories > 0 && (
              <div className="calorie-card-box calorie-zigzag-schedule-box">
                <div className="calorie-box-header">
                  <div>
                    <h3 className="calorie-box-title">7-Day Zigzag Energy Schedule</h3>
                    <p className="calorie-box-desc">
                      Net weekly calories: <strong>{weeklyTotalCals.toLocaleString()} kcal</strong> ({workoutDays} workout days, {7 - workoutDays} rest days)
                    </p>
                  </div>
                </div>

                <div className="calorie-zigzag-week-grid">
                  {daysOfWeek.map((dayItem, idx) => {
                    const dayCals = dayItem.isWorkout ? trainingDayCals : restDayCals
                    return (
                      <div
                        key={idx}
                        className={`calorie-day-card ${dayItem.isWorkout ? 'workout-day' : 'rest-day'}`}
                      >
                        <div className="calorie-day-name">{dayItem.day}</div>
                        <div className="calorie-day-status">
                          {dayItem.isWorkout ? '🔥 Workout' : '🛡️ Rest'}
                        </div>
                        <div className="calorie-day-cals">{dayCals.toLocaleString()}</div>
                        <div className="calorie-day-unit">kcal</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 4. Adaptive Macronutrient Breakdown for This Calorie Target */}
            <div className="calorie-card-box">
              <div className="calorie-box-header calorie-box-header-flex">
                <div>
                  <h3 className="calorie-box-title">Macronutrient Split</h3>
                  <p className="calorie-box-desc">Distribution calculated for {targetCalories.toLocaleString()} kcal</p>
                </div>
                {/* Diet Split Switcher */}
                <div className="calorie-diet-pill-group">
                  {(Object.keys(CALORIE_MACRO_SPLITS) as CalorieDietSplit[]).map((splitKey) => (
                    <button
                      key={splitKey}
                      type="button"
                      className={`calorie-diet-btn ${macroSplit === splitKey ? 'active' : ''}`}
                      onClick={() => setMacroSplit(splitKey)}
                    >
                      {CALORIE_MACRO_SPLITS[splitKey].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calorie-macros-grid">
                {/* Protein */}
                <div className="calorie-macro-card protein-card">
                  <div className="macro-card-header">
                    <span className="macro-card-title">🥩 Protein</span>
                    <span className="macro-card-pct">{Math.round(splitConfig.p * 100)}%</span>
                  </div>
                  <div className="macro-card-value">
                    <span className="macro-grams">{proteinGrams}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <div className="macro-card-cals">{proteinCals.toLocaleString()} kcal</div>
                </div>

                {/* Carbohydrates */}
                <div className="calorie-macro-card carbs-card">
                  <div className="macro-card-header">
                    <span className="macro-card-title">🍚 Carbs</span>
                    <span className="macro-card-pct">{Math.round(splitConfig.c * 100)}%</span>
                  </div>
                  <div className="macro-card-value">
                    <span className="macro-grams">{carbGrams}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <div className="macro-card-cals">{carbCals.toLocaleString()} kcal</div>
                </div>

                {/* Healthy Fats */}
                <div className="calorie-macro-card fats-card">
                  <div className="macro-card-header">
                    <span className="macro-card-title">🥑 Fats</span>
                    <span className="macro-card-pct">{Math.round(splitConfig.f * 100)}%</span>
                  </div>
                  <div className="macro-card-value">
                    <span className="macro-grams">{fatGrams}</span>
                    <span className="macro-unit">g</span>
                  </div>
                  <div className="macro-card-cals">{fatCals.toLocaleString()} kcal</div>
                </div>
              </div>
            </div>

            {/* 5. Coaching Protocol & Scientific Context */}
            <div className="form-tips-card calorie-coaching-tip">
              <div className="form-tips-title">💡 Metabolic Guidance & Calorie Wisdom</div>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--color-text-dim)' }}>
                {currentGoalDef.desc} For maximum adherence, track your morning weight 3–4 times per week and
                take a weekly average. If your weight stalls for more than 14 consecutive days, adjust your intake
                by 100–150 kcal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalorieCalculator
