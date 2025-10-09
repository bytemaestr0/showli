import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Home, Bookmark, Clock, LogOut, Search, LogIn } from 'lucide-react'
import '../styles/navbar.css'

function Navbar({ user, onSignOut, currentPage, onNavigate, onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchParam = params.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
    } else {
      setSearchQuery('')
    }
  }, [location.search])

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }, [searchQuery, onSearch])

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

return (
    <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-left">
          <div 
            onClick={() => onNavigate('home')} 
            className="navbar-logo-container"
          >
            <img 
              src="/favicon.svg" 
              alt="ShowLI" 
              className="navbar-logo-icon"
            />
            <div className="navbar-logo">
              Show<span className="navbar-logo-highlight">LI</span>
            </div>
          </div>

          <div className="navbar-links">
            {user && (
              <>
                <div 
                  onClick={() => onNavigate('bookmarks')}
                  className={`navbar-link ${currentPage === 'bookmarks' ? 'navbar-link-active' : ''}`}
                >
                  <Bookmark size={18} />
                  <span className="navbar-link-text">Bookmarks</span>
                </div>
                
                <div 
                  onClick={() => onNavigate('history')}
                  className={`navbar-link ${currentPage === 'history' ? 'navbar-link-active' : ''}`}
                >
                  <Clock size={18} />
                  <span className="navbar-link-text">History</span>
                </div>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <div className="navbar-search-wrapper">
            <Search className="navbar-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar-search-input"
            />
          </div>
        </form>

        <div className="navbar-user">
          <div 
            onClick={() => onNavigate('home')}
            className={`navbar-home-btn ${currentPage === 'home' ? 'navbar-home-active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          {user ? (
            <>
              <div 
                className="navbar-avatar" 
                title={user.user_metadata?.nickname || user.email}
                onClick={() => onNavigate('profile')}
              >
                {(user.user_metadata?.nickname || user.email)[0].toUpperCase()}
              </div>
              <button onClick={onSignOut} className="navbar-signout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('signin')} 
              className={`navbar-signin ${currentPage === 'signin' ? 'navbar-signin-active' : ''}`}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
