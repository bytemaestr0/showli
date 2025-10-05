import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useWatchHistory = (user) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchHistory()
    } else {
      setHistory([])
      setLoading(false)
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('watch_history')
        .select('*')
        .order('watched_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setHistory(data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToHistory = async (media, season = 1, episode = 1) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('watch_history')
        .upsert({
          user_id: user.id,
          media_id: media.id.toString(),
          media_type: media.media_type,
          title: media.title || media.name,
          poster_path: media.poster_path,
          watched_at: new Date().toISOString(),
          season: season,
          episode: episode
        }, {
          onConflict: 'user_id,media_id'
        })

      if (error) throw error
      await fetchHistory()
    } catch (error) {
      console.error('Error adding to history:', error)
    }
  }

  const updateProgress = async (mediaId, season, episode) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('watch_history')
        .update({
          season: season,
          episode: episode,
          watched_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('media_id', mediaId.toString())

      if (error) throw error
      await fetchHistory()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getProgress = (mediaId) => {
    const item = history.find(h => h.media_id === mediaId.toString())
    return item ? { season: item.season || 1, episode: item.episode || 1 } : { season: 1, episode: 1 }
  }

  const removeFromHistory = async (mediaId) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('watch_history')
        .delete()
        .eq('media_id', mediaId.toString())
        .eq('user_id', user.id)

      if (error) throw error
      await fetchHistory()
    } catch (error) {
      console.error('Error removing from history:', error)
    }
  }

  return { 
    history, 
    loading, 
    addToHistory, 
    updateProgress,
    getProgress,
    removeFromHistory, 
    refetch: fetchHistory 
  }
}
