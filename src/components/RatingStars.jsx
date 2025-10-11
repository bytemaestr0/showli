import { Star } from 'lucide-react'
import '../styles/rating.css'

function RatingStars({ rating, onRate, readOnly = false }) {
  const handleStarClick = (starIndex) => {
    if (readOnly) return
    const newRating = starIndex + 1
    onRate(newRating)
  }

  return (
    <div className="rating-container">
      <div className="stars-wrapper">
        {[0, 1, 2, 3, 4].map((starIndex) => (
          <button
            key={starIndex}
            className={`star-button ${starIndex < rating ? 'filled' : ''}`}
            onClick={() => handleStarClick(starIndex)}
            disabled={readOnly}
            title={`${starIndex + 1} star${starIndex + 1 !== 1 ? 's' : ''}`}
          >
            <Star size={20} fill={starIndex < rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      <span className="rating-text">{Math.round(rating)}/5</span>
    </div>
  )
}

export default RatingStars
