import { useState, useEffect } from 'react'

export const usePlayerState = (mediaType, tmdbId, user, initialProgress = null) => {
  const storageKey = `player_${mediaType}_${tmdbId}`

  // Load saved state from sessionStorage or use initial progress from database
  const loadState = () => {
    try {
      const saved = sessionStorage.getItem(storageKey)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading player state:', error)
    }
    
    // If user is logged in and we have initial progress, use that
    if (user && initialProgress) {
      return {
        source: 'vidsrc',
        season: initialProgress.season || 1,
        episode: initialProgress.episode || 1
      }
    }
    
    return {
      source: 'vidsrc',
      season: 1,
      episode: 1
    }
  }

  const [playerState, setPlayerState] = useState(loadState)

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(playerState))
    } catch (error) {
      console.error('Error saving player state:', error)
    }
  }, [playerState, storageKey])

  const updateSource = (source) => {
    setPlayerState(prev => ({ ...prev, source }))
  }

  const updateSeason = (season) => {
    setPlayerState(prev => ({ ...prev, season }))
  }

  const updateEpisode = (episode) => {
    setPlayerState(prev => ({ ...prev, episode }))
  }

  const updateState = (updates) => {
    setPlayerState(prev => ({ ...prev, ...updates }))
  }

  const clearState = () => {
    try {
      sessionStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Error clearing player state:', error)
    }
  }

  return {
    source: playerState.source,
    season: playerState.season,
    episode: playerState.episode,
    updateSource,
    updateSeason,
    updateEpisode,
    updateState,
    clearState
  }
}

// Export a utility function to clear all player states
export const clearAllPlayerStates = () => {
  try {
    const keys = Object.keys(sessionStorage)
    keys.forEach(key => {
      if (key.startsWith('player_')) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing player states:', error)
  }
}
