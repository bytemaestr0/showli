import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Home, Bookmark, Clock, LogOut, Search, LogIn, Menu, X } from 'lucide-react'
import '../styles/navbar.css'

function Navbar({ user, onSignOut, currentPage, onNavigate, onSearch }) {
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchInputFocused, setSearchInputFocused] = useState(false)
  const location = useLocation()
  const searchInputRef = useRef(null)

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
      setMobileMenuOpen(false)
    }
  }, [searchQuery, onSearch])

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleSearchWrapperClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleMobileNavigate = (page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-content">
        {/* Left: Logo */}
        <div className="navbar-left">
          <div 
            onClick={() => handleMobileNavigate('home')} 
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

          {/* Desktop: Navigation Links */}
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

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <div 
            className="navbar-search-wrapper" 
            onClick={handleSearchWrapperClick}
          >
            <Search className="navbar-search-icon" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
              className="navbar-search-input"
            />
          </div>
        </form>

        {/* Right: User Section */}
        <div className="navbar-user">
          {/* Desktop: Home Button */}
          <div 
            onClick={() => onNavigate('home')}
            className={`navbar-home-btn ${currentPage === 'home' ? 'navbar-home-active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          {user ? (
            <>
              {/* Desktop: Avatar */}
              <div 
                className="navbar-avatar navbar-avatar-desktop" 
                title={user.user_metadata?.nickname || user.email}
                onClick={() => onNavigate('profile')}
              >
                {(user.user_metadata?.nickname || user.email)[0].toUpperCase()}
              </div>
              {/* Desktop: Sign Out */}
              <button onClick={onSignOut} className="navbar-signout navbar-signout-desktop">
                <LogOut size={16} />
              </button>

              {/* Mobile: Avatar + Dropdown */}
              <div className="mobile-menu-container">
                <div 
                  className="navbar-avatar navbar-avatar-mobile"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title={user.user_metadata?.nickname || user.email}
                >
                  {(user.user_metadata?.nickname || user.email)[0].toUpperCase()}
                </div>

                {mobileMenuOpen && (
                  <div className="mobile-dropdown">
                    <button 
                      onClick={() => handleMobileNavigate('bookmarks')}
                      className="mobile-dropdown-item"
                    >
                      <Bookmark size={18} />
                      <span>Bookmarks</span>
                    </button>
                    <button 
                      onClick={() => handleMobileNavigate('history')}
                      className="mobile-dropdown-item"
                    >
                      <Clock size={18} />
                      <span>History</span>
                    </button>
                    <button 
                      onClick={() => handleMobileNavigate('profile')}
                      className="mobile-dropdown-item"
                    >
                      <Home size={18} />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={onSignOut}
                      className="mobile-dropdown-item mobile-dropdown-signout"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
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
