import { useState } from 'react'
import { videoSources } from '../services/videoSources'
import '../styles/player.css'

function VideoPlayer({ mediaType, tmdbId, totalSeasons = 1 }) {
  const [currentSource, setCurrentSource] = useState('vidsrc')
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)

  const sources = videoSources.getEmbedUrls(mediaType, tmdbId, season, episode)

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
          Source 1
        </button>
        <button
          onClick={() => setCurrentSource('vidsrcpro')}
          className={`player-source-btn ${
            currentSource === 'vidsrcpro' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          Source 2
        </button>
        <button
          onClick={() => setCurrentSource('embed')}
          className={`player-source-btn ${
            currentSource === 'embed' 
              ? 'player-source-btn-active' 
              : 'player-source-btn-inactive'
          }`}
        >
          Source 3
        </button>
      </div>

      {/* Episode/Season Selector for TV Shows */}
      {mediaType === 'tv' && (
        <div className="player-episode-selector">
          <div className="player-selector-group">
            <label className="player-selector-label">Season</label>
            <select 
              value={season} 
              onChange={(e) => {
                setSeason(Number(e.target.value))
                setEpisode(1) // Reset to episode 1 when changing season
              }}
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
              {Array.from({ length: 20 }, (_, i) => i + 1).map((ep) => (
                <option key={ep} value={ep}>
                  Episode {ep}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setEpisode(prev => prev + 1)}
            className="player-next-btn"
          >
            Next Episode →
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
