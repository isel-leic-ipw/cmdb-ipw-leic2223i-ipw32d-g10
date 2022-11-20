import fetch from 'node-fetch'

const key = 'k_8rhp1n3b' 
const baseURL = 'https://imdb-api.com/en/API/' 

export function getTopMovies(limit){
    return fetch(baseURL + `Top250Movies/${key}`, {
        headers : {"Accept" : "application/json"}
    })
    .then (response => response.json())
    .then(res => processGetTopMovies(res, limit))
}

function processGetTopMovies(obj, limit) {
    let array = []
    if (limit === ''){
        limit = 250
    }
    for(let i = 0; i < limit; i++){
        let movie = obj.items[i] 
        const result = {
            id: movie.id,
            rank: movie.rank,
            title: movie.title,
            year: movie.year,
            imDbRating: movie.imDbRating
            }
            array[i] = result
    }
    return array
}

export function getMovie(movieName, limit){
    return fetch(baseURL + `SearchMovie/${key}/${movieName}`, {
        headers : {"Accept" : "application/json"}
    })
    .then (response => response.json())
    .then(res => processGetMovie(res, limit))
}    

function processGetMovie(obj, limit) {
    let array = []
    if (limit === ''){
        limit = 250
    }
    const size = obj.results.length
    if(limit > size){
        limit = size
    }
    for(let i = 0; i < limit; i++){
        let movie = obj.results[i]
        const result = {
            id: movie.id,
            title: movie.title
        }
        array[i] = result
    }
    return array
}

export function getMovieById(movieId){
    return fetch(baseURL + `Title/${key}/${movieId}`, {
        headers : {"Accept" : "application/json"}
    })
    .then (response => response.json())
    .then(res => processGetMovieById(res))
}    

function processGetMovieById(obj){
    const result = {
        id: obj.id,
        title: obj.title,
        year: obj.year,
        durationMins: +(obj.runtimeMins)
    }
    return result
}