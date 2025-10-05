import { X } from 'lucide-react'
import { tmdbApi } from '../services/tmdbApi'
import '../styles/components.css'

function MediaCard({ media, onClick, onRemove, showRemove = false }) {
  const title = media.title || media.name
  const year = media.release_date || media.first_air_date
  const rating = media.vote_average?.toFixed(1)

  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove(media)
  }

  return (
    <div className="media-card" onClick={() => onClick(media)}>
      {showRemove && (
        <button className="media-card-remove" onClick={handleRemove} title="Remove">
          <X size={18} />
        </button>
      )}
      <img
        src={tmdbApi.getImageUrl(media.poster_path)}
        alt={title}
        className="media-card-image"
      />
      <div className="media-card-overlay">
        <div className="media-card-title">{title}</div>
        <div className="media-card-meta">
          {year && <span>{year.split('-')[0]}</span>}
          {rating && <span> • ⭐ {rating}</span>}
        </div>
      </div>
    </div>
  )
}

export default MediaCard
