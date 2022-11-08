import services from './movies-service.mjs'

function getMovies(req, resp){
    console.log(req.query)
    return services.getMovies(req.header('Authorization'))
            .then(movie => resp.json(movie))
}

function searchMovieID(req, resp){
    console.log(req.params)
    return services.searchMovieID(req.params.movieID, req.header('Authorization'))
            .then(movie => resp.json(movie))
}

function createGroup(req, resp){
    console.log(req.body)
    return services.createGroup(req.body.text, req.header('Authorization'))
            .then(group =>resp.status(201).json(group))
}

export const webapi ={
    getMovies,
    searchMovieID,
    createGroup
}

export default webapi