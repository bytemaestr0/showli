import { Film } from 'lucide-react'
import MediaCard from '../components/MediaCard'
import RatingStars from '../components/RatingStars'
import { useRating } from '../hooks/useRating'
import '../styles/library.css'

function Bookmarks({ bookmarks, loading, onMediaSelect, onRemove, user }) {
  const { setRating, getRating } = useRating(user)

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">Loading...</div>
      </div>
    )
  }

  const bookmarkItems = bookmarks.map(bookmark => ({
    id: parseInt(bookmark.media_id),
    title: bookmark.title,
    name: bookmark.title,
    poster_path: bookmark.poster_path,
    media_type: bookmark.media_type
  }))

  return (
    <div className="home-container">
      <div className="library-content">
        <div className="library-header">
          <h1 className="library-title">My Bookmarks</h1>
          <p className="library-count">{bookmarks.length} items</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <Film className="empty-state-icon" size={80} />
            <h3 className="empty-state-title">No bookmarks yet</h3>
            <p className="empty-state-text">
              Start bookmarking your favorite movies and TV shows!
            </p>
          </div>
        ) : (
          <div className="library-grid">
            {bookmarkItems.map((item) => (
              <div key={item.id} className="library-item">
                <div className="library-item-image" onClick={() => onMediaSelect(item)}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${bookmarks.find(b => b.media_id === item.id.toString()).poster_path}`}
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

export default Bookmarks
