import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Spinner from '../components/Spinner'
import '../assets/CSS/Progress.css'

interface LogEntry {
    id: number
    weight: number | null
    reps: number | null
    sets: number | null
    duration_seconds: number | null
    logged_at: string
    workouts: { title: string } | null
}

function Progress() {
    const { user } = useAuth()
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        supabase
            .from('workout_logs')
            .select('id, weight, reps, sets, duration_seconds, logged_at, workouts(title)')
            .eq('user_id', user.id)
            .order('logged_at', { ascending: true })
            .then(({ data, error }) => {
                if (error) console.error(error)
                else setLogs((data as unknown as LogEntry[]) ?? [])
                setLoading(false)
            })
    }, [user])

    if (loading) return <Spinner label="Loading Your Progress" />

    const chartData = logs
        .filter((l) => l.weight !== null)
        .map((l) => ({
            date: new Date(l.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: l.weight,
        }))

    return (
        <div className="container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
            <div className="lane-header">
                <span className="lane-tag">{String(logs.length).padStart(2, '0')}</span>
                <div className="lane-line" />
            </div>
            <h1>Your Progress</h1>

            {logs.length === 0 ? (
                <div className="progress-empty-card">
                    <p>No logged sets yet. Go log a set from any workout page to track your strength curves and personal records here.</p>
                    <Link to="/workouts" className="btn">Browse Workouts</Link>
                </div>
            ) : (
                <>
                    {chartData.length > 1 && (
                        <div className="progress-chart-card">
                            <div className="progress-chart-header">
                                <span className="progress-chart-title">Weight Lifted Progression (kg)</span>
                                <span className="badge badge-accent">Strength Curve</span>
                            </div>
                            <ResponsiveContainer width="100%" height="82%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        fontSize={11}
                                        tickLine={false}
                                        stroke="var(--color-text-dim)"
                                    />
                                    <YAxis
                                        fontSize={11}
                                        tickLine={false}
                                        stroke="var(--color-text-dim)"
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-surface-raised)',
                                            borderColor: 'var(--color-line)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--color-text)',
                                            boxShadow: 'var(--shadow-md)',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.85rem',
                                        }}
                                        itemStyle={{ color: 'var(--color-accent)', fontWeight: 600 }}
                                        labelStyle={{ color: 'var(--color-ink)', fontWeight: 700, marginBottom: '4px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="var(--color-accent)"
                                        strokeWidth={2.5}
                                        dot={{ r: 3.5, fill: 'var(--color-accent)', stroke: 'var(--color-surface)', strokeWidth: 1.5 }}
                                        activeDot={{ r: 6, fill: 'var(--color-accent)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div className="lane-header" style={{ marginTop: 'var(--space-5)' }}>
                        <span className="lane-tag">History</span>
                        <div className="lane-line" />
                    </div>

                    <div className="progress-log-list">
                        {[...logs].reverse().map((log) => (
                            <div key={log.id} className="progress-log-card">
                                <div className="progress-log-info">
                                    <span className="progress-log-title">{log.workouts?.title ?? 'Unknown exercise'}</span>
                                    <span className="progress-log-meta">
                                        {new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="progress-log-stat">
                                    {log.duration_seconds !== null
                                        ? `${Math.round(log.duration_seconds / 60)} min${log.sets ? ` \u00d7 ${log.sets} rounds` : ''}`
                                        : `${log.weight ?? '-'}kg \u00d7 ${log.reps ?? '-'} \u00d7 ${log.sets ?? '-'} sets`}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Progress