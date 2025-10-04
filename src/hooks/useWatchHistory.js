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
    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('watch_history')
        .select('id')
        .eq('media_id', media.id.toString())
        .single()

      if (existing) {
        // Update watched_at
        const { error } = await supabase
          .from('watch_history')
          .update({ watched_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase.from('watch_history').insert({
          media_id: media.id.toString(),
          media_type: media.media_type,
          title: media.title || media.name,
          poster_path: media.poster_path
        })

        if (error) throw error
      }

      await fetchHistory()
    } catch (error) {
      console.error('Error adding to history:', error)
    }
  }

  return { history, loading, addToHistory, refetch: fetchHistory }
}
