import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { Calendar, Film, Tv, Lock } from 'lucide-react'
import '../styles/profile.css'

function Profile({ user, history }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown'

  const moviesWatched = history?.filter(item => item.media_type === 'movie').length || 0
  const tvShowsWatched = history?.filter(item => item.media_type === 'tv').length || 0

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (signInError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {(user?.user_metadata?.nickname || user?.email)[0].toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {user?.user_metadata?.nickname || 'User'}
            </h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <Calendar className="profile-stat-icon" size={32} />
            <div className="profile-stat-info">
              <div className="profile-stat-label">Member Since</div>
              <div className="profile-stat-value">{joinDate}</div>
            </div>
          </div>

          <div className="profile-stat-card">
            <Film className="profile-stat-icon" size={32} />
            <div className="profile-stat-info">
              <div className="profile-stat-label">Movies Watched</div>
              <div className="profile-stat-value">{moviesWatched}</div>
            </div>
          </div>

          <div className="profile-stat-card">
            <Tv className="profile-stat-icon" size={32} />
            <div className="profile-stat-info">
              <div className="profile-stat-label">TV Shows Watched</div>
              <div className="profile-stat-value">{tvShowsWatched}</div>
            </div>
          </div>
        </div>

        <div className="profile-password-section">
          <h2 className="profile-section-title">
            <Lock size={24} />
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="profile-password-form">
            {error && <div className="profile-error">{error}</div>}
            {success && <div className="profile-success">{success}</div>}

            <div className="profile-input-group">
              <label className="profile-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="profile-input"
                disabled={loading}
              />
            </div>

            <div className="profile-input-row">
              <div className="profile-input-group">
                <label className="profile-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="profile-input"
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="profile-input-group">
                <label className="profile-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="profile-input"
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="profile-submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
