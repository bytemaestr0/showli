import { useState, useEffect } from 'react'
import { videoSources } from '../services/videoSources'
import { usePlayerState } from '../hooks/usePlayerState'
import '../styles/player.css'

function VideoPlayer({ mediaType, tmdbId, totalSeasons = 1, user, initialProgress, onProgressUpdate }) {
  const { source, season, episode, updateSource, updateSeason, updateEpisode } = usePlayerState(
    mediaType, 
    tmdbId, 
    user, 
    initialProgress
  )
  const [seasonData, setSeasonData] = useState([])
  const [episodeCount, setEpisodeCount] = useState(20)

  useEffect(() => {
    if (mediaType === 'tv') {
      fetchSeasonData()
    }
  }, [mediaType, tmdbId, season])

  // Update progress in database when season/episode changes
  useEffect(() => {
    if (user && mediaType === 'tv' && onProgressUpdate) {
      onProgressUpdate(season, episode)
    }
  }, [season, episode, user, mediaType, onProgressUpdate])

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
    updateSeason(Number(newSeason))
    updateEpisode(1) // Reset to episode 1 when changing season
  }

  const handleEpisodeChange = (newEpisode) => {
    updateEpisode(Number(newEpisode))
  }

  const handleSourceChange = (newSource) => {
    updateSource(newSource)
  }

  const handleNextEpisode = () => {
    if (episode < episodeCount) {
      updateEpisode(episode + 1)
    } else if (season < totalSeasons) {
      updateSeason(season + 1)
      updateEpisode(1)
    }
  }

  return (
    <div>
      <div className="player-video-container">
        <iframe
          key={`${source}-${season}-${episode}`}
          src={sources[source]}
          className="player-iframe"
          allowFullScreen
          title="Video Player"
        />
      </div>

      <div className="player-controls">
        <button
          onClick={() => handleSourceChange('vidsrc')}
          className={`player-source-btn ${
            source === 'vidsrc' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          VidSrc
        </button>
        <button
          onClick={() => handleSourceChange('vidsrcpro')}
          className={`player-source-btn ${
            source === 'vidsrcpro' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          VidSrc Pro
        </button>
        <button
          onClick={() => handleSourceChange('embedsu')}
          className={`player-source-btn ${
            source === 'embedsu' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          Embed.su
        </button>
        <button
          onClick={() => handleSourceChange('autoembed')}
          className={`player-source-btn ${
            source === 'autoembed' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          AutoEmbed
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
              onChange={(e) => handleEpisodeChange(e.target.value)}
              className="player-selector"
            >
              {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
                <option key={ep} value={ep}>
                  Episode {ep}
                  {seasonData[ep - 1] && ` - ${seasonData[ep - 1].name}`}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextEpisode}
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
