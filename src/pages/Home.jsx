import { useState, useEffect } from 'react'
import { tmdbApi } from '../services/tmdbApi'
import MediaCard from '../components/MediaCard'
import SearchBar from '../components/SearchBar'
import '../styles/home.css'

export default function Home({ onMediaSelect }) {
  const [trending, setTrending] = useState([])
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [trendingData, moviesData, tvData] = await Promise.all([
        tmdbApi.getTrending(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getPopularTVShows()
      ])

      setTrending(trendingData.results || [])
      setMovies(moviesData.results || [])
      setTVShows(tvData.results || [])
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearching(true)
    try {
      const data = await tmdbApi.searchMulti(query)
      setSearchResults(data.results?.filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [])
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchResults([])
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>Unlimited movies, TV shows, and more</h1>
          <p>Watch anywhere. Stream anytime.</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="home-content">
        {searchResults.length > 0 ? (
          <div className="home-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="home-section-title">Search Results</h2>
              <button 
                onClick={clearSearch}
                style={{
                  background: '#2a2a2a',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
            <div className="home-grid">
              {searchResults.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  onClick={onMediaSelect}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="home-section">
              <h2 className="home-section-title">Trending Now</h2>
              <div className="home-grid">
                {trending.slice(0, 12).map((item) => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    onClick={onMediaSelect}
                  />
                ))}
              </div>
            </div>

            <div className="home-section">
              <h2 className="home-section-title">Popular Movies</h2>
              <div className="home-grid">
                {movies.slice(0, 12).map((item) => (
                  <MediaCard
                    key={item.id}
                    media={{ ...item, media_type: 'movie' }}
                    onClick={onMediaSelect}
                  />
                ))}
              </div>
            </div>

            <div className="home-section">
              <h2 className="home-section-title">Popular TV Shows</h2>
              <div className="home-grid">
                {tvShows.slice(0, 12).map((item) => (
                  <MediaCard
                    key={item.id}
                    media={{ ...item, media_type: 'tv' }}
                    onClick={onMediaSelect}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
