import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import '../assets/CSS/Profile.css'

interface ProfileData {
  name: string | null
  age: number | null
  gender: string | null
  dob: string | null
  weight: number | null
  height: number | null
}

function Profile() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<ProfileData>({
    name: '', age: null, gender: '', dob: '', weight: null, height: null,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error(error)
        else if (data) {
          setProfile({
            name: data.name ?? '',
            age: data.age,
            gender: data.gender ?? '',
            dob: data.dob ?? '',
            weight: data.weight,
            height: data.height,
          })
        }
        setLoading(false)
      })
  }, [user])

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value === '' ? null : value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: profile.name,
        age: profile.age ? Number(profile.age) : null,
        gender: profile.gender,
        dob: profile.dob,
        weight: profile.weight ? Number(profile.weight) : null,
        height: profile.height ? Number(profile.height) : null,
      })

    setSaving(false)
    setMessage(error ? `Error: ${error.message}` : 'Profile updated successfully.')
  }

  if (loading) return <Spinner label="Loading Profile" />

  const userInitial = (profile.name?.trim()?.[0] || user?.email?.[0] || 'U').toUpperCase()

  return (
    <div className="container profile-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <div className="lane-header">
        <span className="lane-tag">You</span>
        <div className="lane-line" />
      </div>
      <h1>Your Profile</h1>

      <div className="profile-header-card">
        <div className="profile-avatar">{userInitial}</div>
        <div className="profile-header-info">
          <h2>{profile.name || 'Athlete'}</h2>
          <p>{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card">
        <div className="profile-form-grid">
          <div className="profile-full-width">
            <label htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              value={profile.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="profile-age">Age</label>
            <input
              id="profile-age"
              type="number"
              value={profile.age ?? ''}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="e.g. 28"
            />
          </div>

          <div>
            <label htmlFor="profile-gender">Gender</label>
            <select
              id="profile-gender"
              value={profile.gender ?? ''}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="profile-dob">Date of Birth</label>
            <input
              id="profile-dob"
              type="date"
              value={profile.dob ?? ''}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="profile-weight">Weight (kg)</label>
            <input
              id="profile-weight"
              type="number"
              step="0.1"
              value={profile.weight ?? ''}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="e.g. 75.5"
            />
          </div>

          <div className="profile-full-width">
            <label htmlFor="profile-height">Height (cm)</label>
            <input
              id="profile-height"
              type="number"
              step="0.1"
              value={profile.height ?? ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="e.g. 180"
            />
          </div>
        </div>

        {message && (
          <div className={`profile-status-message ${message.startsWith('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <button type="button" className="secondary" onClick={signOut}>
            Log Out
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile