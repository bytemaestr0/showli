import { Film } from 'lucide-react'
import MediaCard from '../components/MediaCard'
import Carousel from '../components/Carousel'
import '../styles/home.css'
import '../styles/components.css'

function Bookmarks({ bookmarks, loading, onMediaSelect, onRemove }) {
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

  const useCarousel = bookmarkItems.length >= 3

  return (
    <div className="home-container">
      <div className="home-content" style={{ paddingTop: '2rem' }}>
        <div className="home-section">
          <h2 className="home-section-title">My Bookmarks</h2>
          
          {bookmarks.length === 0 ? (
            <div className="empty-state">
              <Film className="empty-state-icon" size={80} />
              <h3 className="empty-state-title">No bookmarks yet</h3>
              <p className="empty-state-text">
                Start bookmarking your favorite movies and TV shows!
              </p>
            </div>
          ) : useCarousel ? (
            <Carousel 
              items={bookmarkItems} 
              onMediaSelect={onMediaSelect}
              onRemove={onRemove}
              showRemove={true}
            />
          ) : (
            <div className="home-grid">
              {bookmarkItems.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  onClick={onMediaSelect}
                  onRemove={onRemove}
                  showRemove={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookmarks
