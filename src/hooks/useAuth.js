import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      console.log('Initial session:', session?.user ? 'Logged in' : 'Not logged in')
      setLoading(false)
    })

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
    
    if (error) {
      // Handle duplicate email error
      if (error.message.includes('User already registered') || 
          error.message.includes('already been registered') ||
          error.status === 422) {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      throw error
    }

    // Check if user was created but email confirmation is pending
    if (data.user && !data.session) {
      // This means email confirmation is required
      return data
    }

    // If there's a session but the user already exists, throw error
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error('This email is already registered. Please sign in instead.')
    }
    
    console.log('Sign up successful:', data)
    return data
  }

  const signIn = async (identifier, password) => {
    const isEmail = identifier.includes('@')
    
    if (isEmail) {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: identifier, 
        password 
      })
      if (error) throw error
      console.log('Sign in successful:', data)
      return data
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: identifier, 
        password 
      })
      
      if (error) {
        throw new Error('Invalid nickname/email or password')
      }
      
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
