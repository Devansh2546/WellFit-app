import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
type LogType = 'weight' | 'duration' | 'bodyweight'

interface LogWorkoutFormProps {
    workoutId: number
    logType: LogType
}

function LogWorkoutForm({ workoutId, logType }: LogWorkoutFormProps) {
    const { user } = useAuth()
    const [weight, setWeight] = useState('')
    const [reps, setReps] = useState('')
    const [sets, setSets] = useState('')
    const [durationMin, setDurationMin] = useState('')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    if (!user) return null

    const handleLog = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        const { error } = await supabase.from('workout_logs').insert({
            user_id: user.id,
            workout_id: workoutId,
            weight: logType === 'weight' && weight ? Number(weight) : null,
            reps: logType !== 'duration' && reps ? Number(reps) : null,
            sets: sets ? Number(sets) : null,
            duration_seconds: logType === 'duration' && durationMin ? Number(durationMin) * 60 : null,
        })

        setSaving(false)

        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage('Logged!')
            setWeight('')
            setReps('')
            setSets('')
            setDurationMin('')
        }
    }

    const buttonLabel = logType === 'duration' ? '+ Log This Session' : '+ Log This Set'

    if (!open) {
        return (
            <div className="log-form-container">
                <button
                    type="button"
                    className="secondary"
                    onClick={() => setOpen(true)}
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                >
                    {buttonLabel}
                </button>
            </div>
        )
    }

    return (
        <div className="log-form-container">
            <form onSubmit={handleLog} className="log-form-fields">
                {logType === 'weight' && (
                    <div className="log-field-group" style={{ width: '96px' }}>
                        <label>Weight (kg)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={weight}
                            placeholder="kg"
                            onChange={(e) => setWeight(e.target.value)}
                        />
                    </div>
                )}

                {logType !== 'duration' && (
                    <div className="log-field-group" style={{ width: '80px' }}>
                        <label>Reps</label>
                        <input
                            type="number"
                            value={reps}
                            placeholder="Reps"
                            onChange={(e) => setReps(e.target.value)}
                        />
                    </div>
                )}

                {logType === 'duration' && (
                    <div className="log-field-group" style={{ width: '96px' }}>
                        <label>Minutes</label>
                        <input
                            type="number"
                            step="0.5"
                            value={durationMin}
                            placeholder="Min"
                            onChange={(e) => setDurationMin(e.target.value)}
                        />
                    </div>
                )}

                <div className="log-field-group" style={{ width: '80px' }}>
                    <label>{logType === 'duration' ? 'Rounds' : 'Sets'}</label>
                    <input
                        type="number"
                        value={sets}
                        placeholder="Sets"
                        onChange={(e) => setSets(e.target.value)}
                    />
                </div>

                <div className="log-form-actions">
                    <button type="submit" disabled={saving} style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
                        {saving ? '...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="secondary"
                        onClick={() => setOpen(false)}
                        style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                    >
                        Cancel
                    </button>
                </div>

                {message && (
                    <span className={`log-status-msg ${message.startsWith('Error') ? 'error' : 'success'}`}>
                        {message}
                    </span>
                )}
            </form>
        </div>
    )
}

export default LogWorkoutForm