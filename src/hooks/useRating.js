import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useRating = (user) => {
  const [ratings, setRatings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRatings()
    } else {
      setRatings({})
      setLoading(false)
    }
  }, [user])

  const fetchRatings = async () => {
    try {
      // Create a ratings table if it doesn't exist (handled by Supabase)
      const { data, error } = await supabase
        .from('ratings')
        .select('*')

      if (error && error.code !== 'PGRST116') throw error

      const ratingsMap = {}
      if (data) {
        data.forEach(item => {
          ratingsMap[`${item.media_type}_${item.media_id}`] = item.rating
        })
      }
      setRatings(ratingsMap)
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const setRating = async (mediaId, mediaType, ratingValue) => {
    if (!user?.id) return

    try {
      const key = `${mediaType}_${mediaId}`
      
      // Check if rating exists
      const { data: existing } = await supabase
        .from('ratings')
        .select('id')
        .eq('media_id', mediaId.toString())
        .eq('media_type', mediaType)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({ rating: ratingValue })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('ratings')
          .insert({
            user_id: user.id,
            media_id: mediaId.toString(),
            media_type: mediaType,
            rating: ratingValue
          })

        if (error) throw error
      }

      setRatings(prev => ({
        ...prev,
        [key]: ratingValue
      }))
    } catch (error) {
      console.error('Error setting rating:', error)
    }
  }

  const getRating = (mediaId, mediaType) => {
    const key = `${mediaType}_${mediaId}`
    return ratings[key] || 0
  }

  return { ratings, loading, setRating, getRating }
}
