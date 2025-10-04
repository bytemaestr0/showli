import { useState } from 'react'
import { Search } from 'lucide-react'
import '../styles/components.css'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar-container">
      <Search className="search-bar-icon" size={20} />
      <input
        type="text"
        placeholder="Search movies and TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar-input"
      />
    </form>
  )
}
