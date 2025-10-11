import { Clock } from 'lucide-react'
import MediaCard from '../components/MediaCard'
import RatingStars from '../components/RatingStars'
import { useRating } from '../hooks/useRating'
import '../styles/library.css'

function History({ history, loading, onMediaSelect, onRemove, user }) {
  const { setRating, getRating } = useRating(user)

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">Loading...</div>
      </div>
    )
  }

  const historyItems = history.map(item => ({
    id: parseInt(item.media_id),
    title: item.title,
    name: item.title,
    poster_path: item.poster_path,
    media_type: item.media_type
  }))

  return (
    <div className="home-container">
      <div className="library-content">
        <div className="library-header">
          <h1 className="library-title">Watch History</h1>
          <p className="library-count">{history.length} items</p>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <Clock className="empty-state-icon" size={80} />
            <h3 className="empty-state-title">No watch history</h3>
            <p className="empty-state-text">
              Your recently watched content will appear here
            </p>
          </div>
        ) : (
          <div className="library-grid">
            {historyItems.map((item) => (
              <div key={item.id} className="library-item">
                <div className="library-item-image" onClick={() => onMediaSelect(item)}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${history.find(h => h.media_id === item.id.toString()).poster_path}`}
                    alt={item.title}
                    className="library-poster"
                  />
                  <div className="library-item-overlay">
                    <button 
                      className="library-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(item)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="library-item-info">
                  <h3 className="library-item-title">{item.title}</h3>
                  <RatingStars 
                    rating={getRating(item.id, item.media_type)}
                    onRate={(rating) => setRating(item.id, item.media_type, rating)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
