export const generateMovieSchema = (movie) => {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title || movie.name,
    "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    "description": movie.overview,
    "datePublished": movie.release_date,
    "aggregateRating": movie.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average,
      "bestRating": "10",
      "ratingCount": movie.vote_count
    } : undefined
  }
}

export const generateTVSchema = (show) => {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": show.name,
    "image": `https://image.tmdb.org/t/p/w500${show.poster_path}`,
    "description": show.overview,
    "datePublished": show.first_air_date,
    "numberOfSeasons": show.number_of_seasons,
    "aggregateRating": show.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": show.vote_average,
      "bestRating": "10",
      "ratingCount": show.vote_count
    } : undefined
  }
}
