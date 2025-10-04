import { useState } from 'react'
import { videoSources } from '../services/videoSources'
import '../styles/player.css'

export default function VideoPlayer({ mediaType, tmdbId, season = 1, episode = 1 }) {
  const [currentSource, setCurrentSource] = useState('vidsrc')
  
  const sources = videoSources.getEmbedUrls(mediaType, tmdbId, season, episode)

  return (
    <div>
      <div className="player-video-container">
        <iframe
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
    </div>
  )
}
