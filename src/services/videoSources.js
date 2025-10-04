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
      
      embedsu: type === 'movie'
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,

      autoembed: type === 'movie'
        ? `https://player.autoembed.cc/embed/movie/${tmdbId}`
        : `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`
    }
  }
}
