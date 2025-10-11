import { useState, useEffect } from 'react'
import { tmdbApi } from '../services/tmdbApi'
import { Play, Info, Search } from 'lucide-react'
import MediaCard from '../components/MediaCard'
import Carousel from '../components/Carousel'
import '../styles/home.css'

function Home({ onMediaSelect, user, continueWatching = [], searchResults, onClearSearch }) {
  const [trending, setTrending] = useState([])
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [featured, setFeatured] = useState(null)
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

      const trendingResults = trendingData.results || []
      setTrending(trendingResults)
      setMovies(moviesData.results || [])
      setTVShows(tvData.results || [])
      
      if (trendingResults.length > 0) {
        setFeatured(trendingResults[0])
      }
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-loading">Loading...</div>
      </div>
    )
  }

  const featuredTitle = featured?.title || featured?.name
  const featuredOverview = featured?.overview

  return (
    <div className="home-container">
      {searchResults.length === 0 && featured && (
        <div 
          className="home-hero"
          style={{
            backgroundImage: `url(${tmdbApi.getImageUrl(featured.backdrop_path, 'original')})`
          }}
        >
          <div className="home-hero-content">
            <h1 className="home-hero-title">{featuredTitle}</h1>
            <p className="home-hero-overview">
              {featuredOverview && featuredOverview.length > 150 
                ? featuredOverview.substring(0, 150) + '...' 
                : featuredOverview}
            </p>
            <div className="home-hero-buttons">
              <button 
                className="home-hero-btn home-hero-btn-play"
                onClick={() => onMediaSelect(featured)}
              >
                <Play size={24} fill="currentColor" />
                <span>Play</span>
              </button>
              <button 
                className="home-hero-btn home-hero-btn-info"
                onClick={() => onMediaSelect(featured)}
              >
                <Info size={24} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-content" style={{ paddingTop: searchResults.length > 0 ? '2rem' : '0' }}>
        {searchResults.length > 0 ? (
          <div className="home-section">
            <div className="home-search-header">
              <h2 className="home-section-title" style={{ padding: 0 }}>Search Results</h2>
              <button onClick={onClearSearch} className="home-clear-search">
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
        ) : searchResults.length === 0 && location.search.includes('search=') ? (
          <div className="empty-state">
            <Search className="empty-state-icon" size={80} />
            <h3 className="empty-state-title">No Results Found</h3>
            <p className="empty-state-text">
              We couldn't find any movies or TV shows matching your search. Try different keywords!
            </p>
            <button onClick={onClearSearch} className="home-clear-search" style={{ marginTop: '1.5rem' }}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="home-section">
              <h2 className="home-section-title">Trending Now</h2>
              <Carousel
                items={trending.slice(0, 20)}
                onMediaSelect={onMediaSelect}
              />
            </div>

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

            {user && continueWatching.length > 0 && (
              <div className="home-section">
                <h2 className="home-section-title">Continue Watching</h2>
                {continueWatching.length >= 3 ? (
                  <Carousel
                    items={continueWatching.slice(0, 20).map(item => ({
                      id: parseInt(item.media_id),
                      title: item.title,
                      name: item.title,
                      poster_path: item.poster_path,
                      media_type: item.media_type
                    }))}
                    onMediaSelect={onMediaSelect}
                  />
                ) : (
                  <div className="home-grid">
                    {continueWatching.map(item => (
                      <MediaCard
                        key={item.id}
                        media={{
                          id: parseInt(item.media_id),
                          title: item.title,
                          name: item.title,
                          poster_path: item.poster_path,
                          media_type: item.media_type
                        }}
                        onClick={onMediaSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
