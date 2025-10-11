import { Star } from 'lucide-react'
import '../styles/rating.css'

function RatingStars({ rating, onRate, readOnly = false }) {
  const stars = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  return (
    <div className="rating-container">
      <div className="stars-wrapper">
        {stars.map((starValue) => (
          <button
            key={starValue}
            className={`star-button ${starValue <= rating ? 'filled' : ''} ${starValue - 0.5 === Math.floor(rating) ? 'half' : ''}`}
            onClick={() => !readOnly && onRate(starValue)}
            disabled={readOnly}
            title={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          >
            <Star size={24} />
          </button>
        ))}
      </div>
      <span className="rating-text">{rating.toFixed(1)}</span>
    </div>
  )
}

export default RatingStars
