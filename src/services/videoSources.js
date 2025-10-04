export const videoSources = {
  getEmbedUrls: (mediaType, tmdbId, season = 1, episode = 1) => {
    const type = mediaType === 'movie' ? 'movie' : 'tv'
    
    return {
      vidsrc: type === 'movie' 
        ? `https://vidsrc.to/embed/movie/${tmdbId}`
        : `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
      
      vidsrcpro: type === 'movie'
        ? `https://vidsrc.pro/embed/movie/${tmdbId}`
        : `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`,
      
      embed: type === 'movie'
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
    }
  }
}
