const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const tmdbApi = {
  getTrending: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/all/week?api_key=${API_KEY}`
    )
    return response.json()
  },

  getPopularMovies: async () => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    )
    return response.json()
  },

  getPopularTVShows: async () => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}`
    )
    return response.json()
  },

  getTopRatedTVShows: async () => {
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}`
    )
    return response.json()
  },

  searchMulti: async (query) => {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    )
    return response.json()
  },

  getDetails: async (mediaType, id) => {
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`
    )
    return response.json()
  },

  getTVSeasons: async (tvId) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`
    )
    return response.json()
  },

  getImageUrl: (path, size = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image'
    return `https://image.tmdb.org/t/p/${size}${path}`
  }
}
