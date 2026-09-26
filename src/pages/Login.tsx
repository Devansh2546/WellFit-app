import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../assets/CSS/Login.css'

function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Prevent logged-in users from seeing the login/signup page
  useEffect(() => {
    if (!loading && user) {
      navigate('/profile', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading || user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password)

    setSubmitting(false)

    if (error) {
      setError(error)
    } else {
      navigate('/')
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle()
    if (error) setError(error)
  }

  return (
    <div className="container login-container" style={{ paddingTop: 'var(--space-5)', paddingBottom: 'var(--space-6)' }}>
      <div className="lane-header">
        <span className="lane-tag">Access</span>
        <div className="lane-line" />
      </div>

      <div className="card login-card">
        <div className="login-header-group">
          <h1 className="login-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="login-subtitle">
            {isSignUp
              ? 'Join WellFit to log workout sets, save recipes, and track your progress.'
              : 'Sign in to access your training logs and personalized recommendations.'}
          </p>
        </div>

        <button
          type="button"
          className="login-google-btn"
          onClick={handleGoogleLogin}
        >
          <img style={{ height: '18px', width: '18px' }} src="/google.svg" alt="" aria-hidden="true" />
          Continue with Google
        </button>

        <div className="login-divider">
          <span>Or with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="login-error-msg" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn login-submit-btn">
            {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <button
          type="button"
          className="secondary login-switch-btn"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}

export default Login