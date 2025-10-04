import { useState, useEffect } from 'react'
import { videoSources } from '../services/videoSources'
import '../styles/player.css'

function VideoPlayer({ mediaType, tmdbId, totalSeasons = 1 }) {
  const [currentSource, setCurrentSource] = useState('vidsrc')
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [seasonData, setSeasonData] = useState([])
  const [episodeCount, setEpisodeCount] = useState(20)

  // Load last used source on mount
  useEffect(() => {
    const savedSource = localStorage.getItem('lastSource')
    if (savedSource) {
      setCurrentSource(savedSource)
    }
  }, [])

  // Save source to localStorage when changed
  useEffect(() => {
    localStorage.setItem('lastSource', currentSource)
  }, [currentSource])

  useEffect(() => {
    if (mediaType === 'tv') {
      fetchSeasonData()
    }
  }, [mediaType, tmdbId, season])

  const fetchSeasonData = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdbId}/season/${season}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      )
      const data = await response.json()
      setSeasonData(data.episodes || [])
      setEpisodeCount(data.episodes?.length || 20)
    } catch (error) {
      console.error('Error fetching season data:', error)
      setEpisodeCount(20)
    }
  }

  const sources = videoSources.getEmbedUrls(mediaType, tmdbId, season, episode)

  const handleSeasonChange = (newSeason) => {
    setSeason(Number(newSeason))
    setEpisode(1)
  }

  return (
    <div>
      <div className="player-video-container">
        <iframe
          key={`${currentSource}-${season}-${episode}`}
          src={sources[currentSource]}
          className="player-iframe"
          allowFullScreen
          title="Video Player"
        />
      </div>

      <div className="player-controls">
        <button
          onClick={() => setCurrentSource('vidsrc')}
          className={`player-source-btn ${
            currentSource === 'vidsrc'
              ? 'player-source-btn-active'
              : 'player-source-btn-inactive'
          }`}
        >
          ⭐ Server 1
        </button>
        <button
          onClick={() => setCurrentSource('vidlink')}
          className={`player-source-btn ${
            currentSource === 'vidlink'
              ? 'player-source-btn-active'
              : 'player-source-btn-inactive'
          }`}
        >
          Server 2
        </button>
        <button
          onClick={() => setCurrentSource('superembed')}
          className={`player-source-btn ${
            currentSource === 'superembed'
              ? 'player-source-btn-active'
              : 'player-source-btn-inactive'
          }`}
        >
          ⭐ Server 3
        </button>
      </div>

      {mediaType === 'tv' && (
        <div className="player-episode-selector">
          <div className="player-selector-group">
            <label className="player-selector-label">Season</label>
            <select
              value={season}
              onChange={(e) => handleSeasonChange(e.target.value)}
              className="player-selector"
            >
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                <option key={s} value={s}>
                  Season {s}
                </option>
              ))}
            </select>
          </div>

          <div className="player-selector-group">
            <label className="player-selector-label">Episode</label>
            <select
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="player-selector"
            >
              {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                <option key={ep} value={ep}>
                  {ep}
                  {seasonData[ep - 1] && ` - ${seasonData[ep - 1].name}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              if (episode < episodeCount) {
                setEpisode(episode + 1)
              } else if (season < totalSeasons) {
                setSeason(season + 1)
                setEpisode(1)
              }
            }}
            className="player-next-btn"
            disabled={episode >= episodeCount && season >= totalSeasons}
          >
            Next Episode →
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer

