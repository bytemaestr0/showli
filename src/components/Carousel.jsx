import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import '../styles/components.css'

function Carousel({ items, onMediaSelect }) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef(null)

  const scroll = (direction) => {
    if (!carouselRef.current) return

    const container = carouselRef.current
    const cardWidth = container.querySelector('.media-card')?.offsetWidth || 200
    const gap = 24 // 1.5rem in pixels
    const scrollAmount = (cardWidth + gap) * 2 // Scroll 2 cards

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft)
    }
  }

  // Duplicate items for infinite loop effect
  const loopedItems = [...items, ...items, ...items]

  return (
    <div className="carousel-container">
      <button
        className="carousel-arrow carousel-arrow-left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeft size={32} />
      </button>

      <div
        ref={carouselRef}
        className="carousel-track"
        onScroll={handleScroll}
      >
        {loopedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="carousel-item">
            <MediaCard media={item} onClick={onMediaSelect} />
          </div>
        ))}
      </div>

      <button
        className="carousel-arrow carousel-arrow-right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  )
}

export default Carousel
