import store from '../store'
import req from '../../utils/req'

function translateGenre(genre) {
  switch(genre) {
    case 'science-fiction':
      return 'sci-fi'
    case 'sports':
      return 'sport'
    default:
      return genre
  }
}

export function exists(code, list, set = false) {
  const { movies } = store.getState().search
  if (!set) {
    for (let i in movies) {
      if (movies[i]) {
        if (movies[i].code === code)
          return true
      }
    }
  }
  return false
}

export function formatMovies(list, callback, set = false) {
  let movies = []
  let title = ''
  let image = ''
  let id = ''
  let code = ''

  for(let i in list) {
    if (list[i].images && list[i].images.banner) {
      image = list[i].images.poster
      title = list[i].title
      id = list[i].imdb_id
      code = list[i].imdb_id
    } else if (list[i].medium_cover_image) {
      image = list[i].medium_cover_image
      title = list[i].title
      code = list[i].imdb_code
      id = list[i].id
    } else {
      id = ''
    }
    if (id && !exists(code, movies, set)) {
      movies.push({
        id: id,
        code: code,
        image: image,
        title: title
      })
    }
  }
  callback(movies)
}

export function fetchMovies(options = {}) {
  return (dispatch, getState) => {

    let { word, genre, sort, api } = options
    let search = getState().search
    if (word === undefined) word = search.word
    if (genre === undefined) genre = search.genre
    if (sort === undefined) sort = search.sort
    if (api === undefined) api = search.api
    let list = []

    if (api === 'popcorntime' || api === 'yts') {
      dispatch(setOptions(word, genre, sort, api))
    }
    if (api === 'popcorntime') {
      let url = 'https://tv-v2.api-fetch.website/movies/1?'
      if (word) url += '&keywords=' + word
      if (genre) url += '&genre=' + genre
      if (sort) url += '&sort=' + sort
      dispatch(fetching())
      req(url).then(res => {
        formatMovies(res, (movies) => {
          dispatch(setMovies(movies))
        }, true)
      })
    } else if (api === 'yts') {
      let url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=30'
      if (word) url += '&query_term=' + word
      if (genre) url += '&genre=' + translateGenre(genre)
      if (sort) url += '&sort_by=' + sort
      dispatch(fetching())
      req(url).then(res => {
        if (res.data.movies)
          list = res.data.movies
        formatMovies(list, (movies) => {
          dispatch(setMovies(movies))
        }, true)
      })
    }
  }
}

export function fetchAddMovies() {
  return (dispatch, getState) => {
    let list = []
    let search = getState().search
    if (search.isFetching) return

    if (search.api === 'popcorntime') {
      let url = 'https://tv-v2.api-fetch.website/movies/' + search.page + 1 + '?'
      if (search.word) url += '&keywords=' + search.word
      if (search.genre) url += '&genre=' + search.genre
      if (search.sort) url += '&sort=' + search.sort
      dispatch(fetching())
      req(url).then(res => {
        formatMovies(res, (movies) => {
          dispatch(addMovies(movies))
        })
      })
    } else if (search.api === 'yts') {
      let url = 'https://yts.am/api/v2/list_movies.json?sort_by=like_count&limit=50&page=' + search.page
      if (search.word) url += '&query_term=' + search.word
      if (search.genre) url += '&genre=' + translateGenre(search.genre)
      if (search.sort) url += '&sort_by=' + search.sort
      dispatch(fetching())
      req(url).then(res => {
        if (res.data.movies)
          list = res.data.movies
        formatMovies(list, (movies) => {
          dispatch(addMovies(movies))
        })
      })
    }
  }
}

export function addMovies(res) {
  return {
    type: 'ADD_MOVIES',
    movies: res
  }
}

export function setMovies(movies) {
  return {
    type: 'SET_MOVIES',
    movies: movies,
  }
}

export function setOptions(word, genre, sort, api) {
  return {
    type: 'SET_OPTIONS',
    word: word,
    genre: genre,
    sort: sort,
    api: api,
  }
}

export function fetching() {
  return {
    type: 'SEARCH_FETCHING'
  }
}
