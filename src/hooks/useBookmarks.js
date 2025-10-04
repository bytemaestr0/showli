import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useBookmarks = (user) => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    } else {
      setBookmarks([])
      setLoading(false)
    }
  }, [user])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addBookmark = async (media) => {
    if (!user?.id) {
      alert('Please sign in to bookmark')
      return
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: user.id,
          media_id: media.id.toString(),
          media_type: media.media_type,
          title: media.title || media.name,
          poster_path: media.poster_path
        }])
        .select()

      if (error) {
        // Handle duplicate key error gracefully
        if (error.code === '23505') {
          console.log('Already bookmarked')
          return
        }
        throw error
      }

      await fetchBookmarks()
    } catch (error) {
      console.error('Error adding bookmark:', error)
      alert('Failed to add bookmark')
    }
  }

  const removeBookmark = async (mediaId) => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('media_id', mediaId.toString())

      if (error) throw error
      await fetchBookmarks()
    } catch (error) {
      console.error('Error removing bookmark:', error)
    }
  }

  const isBookmarked = (mediaId) => {
    return bookmarks.some(b => b.media_id === mediaId.toString())
  }

  return { bookmarks, loading, addBookmark, removeBookmark, isBookmarked, refetch: fetchBookmarks }
}
