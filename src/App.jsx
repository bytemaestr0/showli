import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Player from './pages/Player'
import SignIn from './pages/SignIn'
import Bookmarks from './pages/Bookmarks'
import History from './pages/History'
import Profile from './pages/Profile'
import { useAuth } from './hooks/useAuth'
import { useBookmarks } from './hooks/useBookmarks'
import { useWatchHistory } from './hooks/useWatchHistory'
import { useRating } from './hooks/useRating'
import { tmdbApi } from './services/tmdbApi'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [selectedMedia, setSelectedMedia] = useState(() => {
    try {
      const saved = sessionStorage.getItem('selectedMedia')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [navigatingTo, setNavigatingTo] = useState(null)
  
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { bookmarks, loading: bookmarksLoading, addBookmark, removeBookmark, isBookmarked } = useBookmarks(user)
  const { history, loading: historyLoading, addToHistory, updateProgress, getProgress, removeFromHistory } = useWatchHistory(user)
  const { setRating, getRating } = useRating(user)

  // Get current page from URL
  const getCurrentPage = () => {
    const pathname = location.pathname
    if (pathname === '/signin') return 'signin'
    if (pathname === '/bookmarks') return 'bookmarks'
    if (pathname === '/history') return 'history'
    if (pathname === '/profile') return 'profile'
    if (pathname.includes('/player')) return 'player'
    return 'home'
  }

  const currentPage = getCurrentPage()

  // Check for search query in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchParam = params.get('search')
    
    if (searchParam) {
      setSearchQuery(searchParam)
      handleSearch(searchParam)
    } else {
      setSearchResults([])
      setSearchQuery('')
    }
  }, [location.search])

  // Save selected media to sessionStorage
  useEffect(() => {
    if (selectedMedia) {
      sessionStorage.setItem('selectedMedia', JSON.stringify(selectedMedia))
    } else {
      sessionStorage.removeItem('selectedMedia')
    }
  }, [selectedMedia])

  // ONLY redirect if user is loaded and not authenticated AND trying to access protected route
  useEffect(() => {
    if (!authLoading && !user && (location.pathname === '/bookmarks' || location.pathname === '/history' || location.pathname === '/profile')) {
      navigate('/signin', { replace: true })
    }
  }, [user, location.pathname, navigate, authLoading])

  const handleSearch = async (query) => {
    try {
      const data = await tmdbApi.searchMulti(query)
      setSearchResults(data.results?.filter(item => 
        item.media_type === 'movie' || item.media_type === 'tv'
      ) || [])
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const clearSearch = () => {
    setSearchResults([])
    setSearchQuery('')
    navigate('/')
  }

  const handleMediaSelect = (media) => {
    setSelectedMedia(media)
    navigate(`/player/${media.media_type}/${media.id}`)
    window.scrollTo(0, 0)
  }

  const handleToggleBookmark = async (media) => {
    if (!user) {
      navigate('/signin')
      return
    }

    if (isBookmarked(media.id)) {
      await removeBookmark(media.id)
    } else {
      await addBookmark(media)
    }
  }

  const handleRemoveBookmark = async (media) => {
    await removeBookmark(media.id)
  }

  const handleRemoveHistory = async (media) => {
    await removeFromHistory(media.id)
  }

  const handleNavigate = (page) => {
    // Prevent multiple navigation calls
    if (navigatingTo === page) {
      return
    }

    setNavigatingTo(page)

    if ((page === 'bookmarks' || page === 'history' || page === 'profile') && !user) {
      navigate('/signin')
      setNavigatingTo(null)
      return
    }
    
    switch (page) {
      case 'home':
        navigate('/')
        break
      case 'signin':
        navigate('/signin')
        break
      case 'bookmarks':
        navigate('/bookmarks')
        break
      case 'history':
        navigate('/history')
        break
      case 'profile':
        navigate('/profile')
        break
      default:
        navigate('/')
    }
    
    window.scrollTo(0, 0)
    setNavigatingTo(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setSelectedMedia(null)
    sessionStorage.clear()
  }

  const handleAuthSuccess = () => {
    navigate('/')
  }

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      setSearchQuery(query)
      navigate(`/?search=${encodeURIComponent(query)}`)
    }
  }

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a1a1a',
        color: '#667eea'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <Navbar 
        user={user}
        onSignOut={handleSignOut}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={handleSearchSubmit}
      />

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onMediaSelect={handleMediaSelect}
              user={user}
              continueWatching={history}
              searchResults={searchResults}
              onClearSearch={clearSearch}
            />
          } 
        />

        <Route 
          path="/player/:mediaType/:id" 
          element={
            selectedMedia ? (
              <Player 
                media={selectedMedia}
                user={user}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                onAddToHistory={addToHistory}
                getProgress={getProgress}
                updateProgress={updateProgress}
              />
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white'
              }}>
                Loading player...
              </div>
            )
          } 
        />

        <Route 
          path="/signin" 
          element={
            <SignIn 
              onSignIn={signIn}
              onSignUp={signUp}
              onSuccess={handleAuthSuccess}
            />
          } 
        />

        <Route 
          path="/bookmarks" 
          element={
            user && !authLoading ? (
              <Bookmarks 
                bookmarks={bookmarks}
                loading={bookmarksLoading}
                onMediaSelect={handleMediaSelect}
                onRemove={handleRemoveBookmark}
                user={user}
              />
            ) : null
          } 
        />

        <Route 
          path="/history" 
          element={
            user && !authLoading ? (
              <History 
                history={history}
                loading={historyLoading}
                onMediaSelect={handleMediaSelect}
                onRemove={handleRemoveHistory}
                user={user}
              />
            ) : null
          } 
        />

        <Route 
          path="/profile" 
          element={
            user && !authLoading ? (
              <Profile 
                user={user}
                history={history}
              />
            ) : null
          } 
        />
      </Routes>
    </div>
  )
}

export default App
