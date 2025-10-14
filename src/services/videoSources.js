export const videoSources = {
  getEmbedUrls: (mediaType, tmdbId, season = 1, episode = 1) => {
    const type = mediaType === 'movie' ? 'movie' : 'tv'
    
    return {
      vidsrc: type === 'movie'
        ? `https://vidsrc.to/embed/movie/${tmdbId}?autoplay=1&no-ads=true`
        : `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1&no-ads=true`,

      vidlink: type === 'movie'
        ? `https://vidlink.pro/movie/${tmdbId}?minimal=1`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?minimal=1`,

      superembed: type === 'movie'
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
    }
  }
}

