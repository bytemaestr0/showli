import { useState, useEffect } from 'react'
import { Home, Bookmark, Clock, LogOut } from 'lucide-react'
import '../styles/navbar.css'

export default function Navbar({ user, onSignOut, currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-content">
        <div 
          onClick={() => onNavigate('home')} 
          className="navbar-logo"
        >
          Showli
        </div>

        <div className="navbar-links">
          <div 
            onClick={() => onNavigate('home')}
            className={`navbar-link ${currentPage === 'home' ? 'navbar-link-active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </div>
          
          {user && (
            <>
              <div 
                onClick={() => onNavigate('bookmarks')}
                className={`navbar-link ${currentPage === 'bookmarks' ? 'navbar-link-active' : ''}`}
              >
                <Bookmark size={18} />
                <span>Bookmarks</span>
              </div>
              
              <div 
                onClick={() => onNavigate('history')}
                className={`navbar-link ${currentPage === 'history' ? 'navbar-link-active' : ''}`}
              >
                <Clock size={18} />
                <span>History</span>
              </div>
            </>
          )}
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="navbar-avatar">
                {user.email[0].toUpperCase()}
              </div>
              <button onClick={onSignOut} className="navbar-signout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('signin')} 
              className="navbar-signout"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
