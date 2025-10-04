import { useState, useEffect } from 'react'
import { tmdbApi } from '../services/tmdbApi'
import MediaCard from '../components/MediaCard'
import SearchBar from '../components/SearchBar'
import Carousel from '../components/Carousel'
import '../styles/home.css'

function Home({ onMediaSelect, user, continueWatching = [] }) {
  const [trending, setTrending] = useState([])
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const [trendingData, moviesData, tvData] = await Promise.all([
        tmdbApi.getTrending(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedTVShows()
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
    try {
      const data = await tmdbApi.searchMulti(query)
      setSearchResults(data.results?.filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [])
    } catch (error) {
      console.error('Error searching:', error)
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
            <div className="home-search-header">
              <h2 className="home-section-title" style={{ padding: 0 }}>Search Results</h2>
              <button onClick={clearSearch} className="home-clear-search">
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
            {/* Continue Watching Section */}
            {user && continueWatching.length > 0 && (
              <div className="home-section">
                <h2 className="home-section-title">Continue Watching</h2>
                <Carousel
                  items={continueWatching.slice(0, 12).map(item => ({
                    id: parseInt(item.media_id),
                    title: item.title,
                    name: item.title,
                    poster_path: item.poster_path,
                    media_type: item.media_type
                  }))}
                  onMediaSelect={onMediaSelect}
                />
              </div>
            )}

            {/* Trending Now Section */}
            <div className="home-section">
              <h2 className="home-section-title">Trending Now</h2>
              <Carousel
                items={trending.slice(0, 20)}
                onMediaSelect={onMediaSelect}
              />
            </div>

            {/* Popular Movies Section */}
            <div className="home-section">
              <h2 className="home-section-title">Popular Movies</h2>
              <Carousel
                items={movies.slice(0, 20).map(item => ({
                  ...item,
                  media_type: 'movie'
                }))}
                onMediaSelect={onMediaSelect}
              />
            </div>

            {/* Top Rated TV Shows Section */}
            <div className="home-section">
              <h2 className="home-section-title">Top Rated TV Shows</h2>
              <Carousel
                items={tvShows.slice(0, 20).map(item => ({
                  ...item,
                  media_type: 'tv'
                }))}
                onMediaSelect={onMediaSelect}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
