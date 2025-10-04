import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { tmdbApi } from '../services/tmdbApi'
import VideoPlayer from '../components/VideoPlayer'
import '../styles/player.css'

export default function Player({ 
  media, 
  user, 
  isBookmarked, 
  onToggleBookmark,
  onAddToHistory 
}) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDetails()
    if (user) {
      onAddToHistory(media)
    }
  }, [media.id])

  const loadDetails = async () => {
    try {
      const data = await tmdbApi.getDetails(media.media_type, media.id)
      setDetails(data)
    } catch (error) {
      console.error('Error loading details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="player-container">
        <div className="home-loading">Loading...</div>
      </div>
    )
  }

  const title = details.title || details.name
  const year = (details.release_date || details.first_air_date)?.split('-')[0]
  const rating = details.vote_average?.toFixed(1)
  const runtime = details.runtime || details.episode_run_time?.[0]

  return (
    <div className="player-container">
      <div className="player-wrapper">
        <VideoPlayer 
          mediaType={media.media_type}
          tmdbId={media.id}
        />

        <div className="player-info">
          <h1 className="player-title">{title}</h1>
          
          <div className="player-meta">
            {year && <span>{year}</span>}
            {rating && <span>⭐ {rating}</span>}
            {runtime && <span>{runtime} min</span>}
            {details.genres && (
              <span>{details.genres.map(g => g.name).join(', ')}</span>
            )}
          </div>

          {details.overview && (
            <p className="player-overview">{details.overview}</p>
          )}

          <div className="player-actions">
            {user && (
              <button
                onClick={() => onToggleBookmark(media)}
                className={`player-action-btn player-bookmark-btn ${
                  isBookmarked(media.id) ? 'player-bookmark-btn-active' : ''
                }`}
              >
                {isBookmarked(media.id) ? (
                  <>
                    <BookmarkCheck size={18} />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark size={18} />
                    Add Bookmark
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
