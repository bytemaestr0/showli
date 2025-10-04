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

  const addToHistory = async (media) => {
    if (!user?.id) return

    try {
      // Use upsert to handle duplicates automatically
      const { error } = await supabase
        .from('watch_history')
        .upsert({
          user_id: user.id,
          media_id: media.id.toString(),
          media_type: media.media_type,
          title: media.title || media.name,
          poster_path: media.poster_path,
          watched_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,media_id'
        })

      if (error) throw error
      await fetchHistory()
    } catch (error) {
      console.error('Error adding to history:', error)
    }
  }

  return { history, loading, addToHistory, refetch: fetchHistory }
}
