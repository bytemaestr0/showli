import { useState } from 'react'
import '../styles/auth.css'

function SignIn({ onSignIn, onSignUp, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [identifier, setIdentifier] = useState('') // email or nickname for login
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (isSignUp) {
      if (!email || !nickname || !password || !confirmPassword) {
        setError('All fields are required')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (nickname.length < 3) {
        setError('Nickname must be at least 3 characters')
        return
      }
    } else {
      if (!identifier || !password) {
        setError('Email/Nickname and password are required')
        return
      }
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await onSignUp(email, password, nickname)
        alert('Account created! Please check your email to confirm.')
        // Switch to sign in mode
        setIsSignUp(false)
        setIdentifier(email)
        setEmail('')
        setNickname('')
        setPassword('')
        setConfirmPassword('')
      } else {
        await onSignIn(identifier, password)
        onSuccess()
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setIdentifier('')
    setEmail('')
    setNickname('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-text">Showli</div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          {isSignUp ? (
            <>
              <div className="auth-input-group">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="auth-input"
                  required
                  minLength={3}
                  placeholder="Choose a nickname"
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />
              </div>
            </>
          ) : (
            <>
              <div className="auth-input-group">
                <label className="auth-label">Email or Nickname</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="auth-input"
                  required
                  placeholder="Enter your email or nickname"
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={switchMode}
            className="auth-toggle-btn"
            type="button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignIn
