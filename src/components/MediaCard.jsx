import { tmdbApi } from '../services/tmdbApi'
import '../styles/components.css'

function MediaCard({ media, onClick }) {
  const title = media.title || media.name
  const year = media.release_date || media.first_air_date
  const rating = media.vote_average?.toFixed(1)

  return (
    <div className="media-card" onClick={() => onClick(media)}>
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
