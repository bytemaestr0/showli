import { Film } from 'lucide-react'
import Carousel from '../components/Carousel'
import '../styles/home.css'
import '../styles/components.css'

function Bookmarks({ bookmarks, loading, onMediaSelect }) {
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
          ) : (
            <Carousel items={bookmarkItems} onMediaSelect={onMediaSelect} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookmarks
