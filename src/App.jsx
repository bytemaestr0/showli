import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Player from './pages/Player'
import SignIn from './pages/SignIn'
import Bookmarks from './pages/Bookmarks'
import History from './pages/History'
import { useAuth } from './hooks/useAuth'
import { useBookmarks } from './hooks/useBookmarks'
import { useWatchHistory } from './hooks/useWatchHistory'
import { tmdbApi } from './services/tmdbApi'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { bookmarks, loading: bookmarksLoading, addBookmark, removeBookmark, isBookmarked } = useBookmarks(user)
  const { history, loading: historyLoading, addToHistory } = useWatchHistory(user)

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
  }

  const handleMediaSelect = (media) => {
    setSelectedMedia(media)
    setCurrentPage('player')
    clearSearch()
    window.scrollTo(0, 0)
  }

  const handleToggleBookmark = async (media) => {
    if (!user) {
      setCurrentPage('signin')
      return
    }

    if (isBookmarked(media.id)) {
      await removeBookmark(media.id)
    } else {
      await addBookmark(media)
    }
  }

  const handleNavigate = (page) => {
    if ((page === 'bookmarks' || page === 'history') && !user) {
      setCurrentPage('signin')
      return
    }
    setCurrentPage(page)
    clearSearch()
    window.scrollTo(0, 0)
  }

  const handleSignOut = async () => {
    await signOut()
    setCurrentPage('home')
  }

  const handleAuthSuccess = () => {
    setCurrentPage('home')
  }

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#0a0a0a',
        color: '#667eea'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar 
        user={user}
        onSignOut={handleSignOut}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
      />

      {currentPage === 'home' && (
        <Home 
          onMediaSelect={handleMediaSelect}
          user={user}
          continueWatching={history}
          searchResults={searchResults}
          onClearSearch={clearSearch}
        />
      )}

      {currentPage === 'player' && selectedMedia && (
        <Player 
          media={selectedMedia}
          user={user}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark}
          onAddToHistory={addToHistory}
        />
      )}

      {currentPage === 'signin' && (
        <SignIn 
          onSignIn={signIn}
          onSignUp={signUp}
          onSuccess={handleAuthSuccess}
        />
      )}

      {currentPage === 'bookmarks' && (
        <Bookmarks 
          bookmarks={bookmarks}
          loading={bookmarksLoading}
          onMediaSelect={handleMediaSelect}
        />
      )}

      {currentPage === 'history' && (
        <History 
          history={history}
          loading={historyLoading}
          onMediaSelect={handleMediaSelect}
        />
      )}
    </div>
  )
}

export default App
