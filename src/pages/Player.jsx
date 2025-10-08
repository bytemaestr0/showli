import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { tmdbApi } from '../services/tmdbApi'
import VideoPlayer from '../components/VideoPlayer'
import '../styles/player.css'

function Player({ 
  media, 
  user, 
  isBookmarked, 
  onToggleBookmark,
  onAddToHistory,
  getProgress,
  updateProgress
}) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialProgress, setInitialProgress] = useState(null)
useEffect(() => {
  if (details) {
    const title = details.title || details.name
    document.title = `Watch ${title} Free | ShowLI`
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Watch ${title} online for free. ${details.overview?.substring(0, 150)}...`
      )
    }
  }
}, [details])
  useEffect(() => {
    loadDetails()
    
    // Get initial progress for TV shows if user is logged in
    if (user && media.media_type === 'tv' && getProgress) {
      const progress = getProgress(media.id)
      setInitialProgress(progress)
    }
    
    // Add to history when component mounts
    if (user && onAddToHistory) {
      const progress = getProgress ? getProgress(media.id) : { season: 1, episode: 1 }
      onAddToHistory(media, progress.season, progress.episode)
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

  const handleProgressUpdate = (season, episode) => {
    if (user && updateProgress && media.media_type === 'tv') {
      updateProgress(media.id, season, episode)
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
  const totalSeasons = details.number_of_seasons || 1

  return (
    <div className="player-container">
      <div className="player-wrapper">
        <VideoPlayer 
          mediaType={media.media_type}
          tmdbId={media.id}
          totalSeasons={totalSeasons}
          user={user}
          initialProgress={initialProgress}
          onProgressUpdate={handleProgressUpdate}
        />

        <div className="player-info">
          <h1 className="player-title">{title}</h1>
          
          <div className="player-meta">
            {year && <span>{year}</span>}
            {rating && <span>⭐ {rating}</span>}
            {runtime && <span>{runtime} min</span>}
            {media.media_type === 'tv' && totalSeasons && (
              <span>{totalSeasons} Season{totalSeasons > 1 ? 's' : ''}</span>
            )}
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

export default Player
