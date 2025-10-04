import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      console.log('Initial session:', session?.user ? 'Logged in' : 'Not logged in')
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, nickname) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          nickname: nickname
        }
      }
    })
    if (error) throw error
    console.log('Sign up successful:', data)
    return data
  }

  const signIn = async (identifier, password) => {
    // Check if identifier is an email
    const isEmail = identifier.includes('@')
    
    if (isEmail) {
      // Sign in with email
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: identifier, 
        password 
      })
      if (error) throw error
      console.log('Sign in successful:', data)
      return data
    } else {
      // Sign in with nickname - need to find the email first
      // Query users by nickname from user metadata
      const { data: users, error: queryError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('raw_user_meta_data->>nickname', identifier)
        .single()

      if (queryError) {
        // Fallback: try signing in assuming it's an email anyway
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: identifier, 
          password 
        })
        if (error) throw new Error('Invalid nickname/email or password')
        return data
      }

      // Sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: users.email, 
        password 
      })
      if (error) throw error
      console.log('Sign in successful:', data)
      return data
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    console.log('Sign out successful')
  }

  return { user, loading, signUp, signIn, signOut }
}
