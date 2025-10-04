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

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedMedia, setSelectedMedia] = useState(null)
  
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { bookmarks, loading: bookmarksLoading, addBookmark, removeBookmark, isBookmarked } = useBookmarks(user)
  const { history, loading: historyLoading, addToHistory } = useWatchHistory(user)

  const handleMediaSelect = (media) => {
    setSelectedMedia(media)
    setCurrentPage('player')
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
    window.scrollTo(0, 0)
  }

  const handleSignOut = async () => {
    await signOut()
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
      />

      {currentPage === 'home' && (
        <Home onMediaSelect={handleMediaSelect} />
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
