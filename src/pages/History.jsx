import { Clock } from 'lucide-react'
import Carousel from '../components/Carousel'
import '../styles/home.css'
import '../styles/components.css'

function History({ history, loading, onMediaSelect }) {
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
      <div className="home-content" style={{ paddingTop: '2rem' }}>
        <div className="home-section">
          <h2 className="home-section-title">Watch History</h2>
          
          {history.length === 0 ? (
            <div className="empty-state">
              <Clock className="empty-state-icon" size={80} />
              <h3 className="empty-state-title">No watch history</h3>
              <p className="empty-state-text">
                Your recently watched content will appear here
              </p>
            </div>
          ) : (
            <Carousel items={historyItems} onMediaSelect={onMediaSelect} />
          )}
        </div>
      </div>
    </div>
  )
}

export default History
