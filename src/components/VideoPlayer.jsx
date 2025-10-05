import { useState, useEffect } from 'react'
import { videoSources } from '../services/videoSources'
import { usePlayerState } from '../hooks/usePlayerState'
import { Star } from 'lucide-react'
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
    updateEpisode(1)
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
        {/* Server 1 (vidlink) first */}
        <button
          onClick={() => handleSourceChange('vidlink')}
          className={`player-source-btn ${
            source === 'vidlink'
              ? 'player-source-btn-active'
              : 'player-source-btn-inactive'
          }`}
        >
          ⭐ Server 1
        </button>

        {/* Server 2 (vidsrc) second, with star */}
        <button
          onClick={() => handleSourceChange('vidsrc')}
          className={`player-source-btn ${
            source === 'vidsrc'
              ? 'player-source-btn-active'
              : 'player-source-btn-inactive'
          }`}
        >
          Server 2
        </button>

        {/* Server 3 (superembed) last, with star */}
        <button
          onClick={() => handleSourceChange('superembed')}
          className={`player-source-btn ${
            source === 'superembed'
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
              onChange={(e) => handleEpisodeChange(e.target.value)}
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

