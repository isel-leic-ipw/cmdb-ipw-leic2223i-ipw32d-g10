import errors from './errors/cmdb-errors.mjs'

export default function(groupsData, moviesData, mode) {
    if (!groupsData) {
        throw errors.INVALID_PARAMETER('groupsData')
    }
    if (!moviesData) {
        throw errors.INVALID_PARAMETER('moviesData')
    }
    return {
        validateUser: validateUser,
        getTopMovies: getTopMovies,
        getMovie: getMovie,
        createUser: createUser,
        getAllGroups: getAllGroups,
        createGroup: createGroup,
        deleteGroup: deleteGroup,
        editGroup: editGroup,
        getGroupDetails: getGroupDetails,
        addMovie: addMovie,
        removeMovie: removeMovie,
        movieDetails: movieDetails
    }

function validateUser(username, password){
        return groupsData.getUserByUsername(username)
                .then(user => {
                    if(user.password === password) return Promise.resolve({username : user.username , token : user.token})
                    else return Promise.reject(errors.INVALID_CREDENTIALS())
                })
}

async function getTopMovies(limit) {
    checkLimit(limit)
    return moviesData.getTopMovies(limit)
}


async function getMovie(movieName, limit){
    checkLimit(limit)
    const movies = await moviesData.getMovie(movieName, limit)
    if (movies.length == 0){
        throw errors.MOVIE_NOT_FOUND(`name`,`${movieName}`)
    }
    return movies
}


async function createUser(username, password){
    if (checkUndefined(username) || checkUndefined(password)) {
        throw errors.INVALID_PARAMETER(`username, password`)
    }
    return groupsData.createUser(username, password, mode)
}


async function getAllGroups(userToken){
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    return groupsData.getAllGroups(user.id, mode)
}


async function createGroup(userToken, body){
    const name = body.name
    const description = body.description
    if (checkUndefined(name) || checkUndefined(description)){
        throw errors.INVALID_PARAMETER(`name or description`)
    }
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    return groupsData.createGroup(user.id, name, description, mode)
}


async function deleteGroup(userToken, groupToDelete){ 
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToDelete, mode)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToDelete}`)
    }
    return groupsData.deleteGroup(group, mode)
}


async function editGroup(userToken, groupToEdit, body){
    const name = body.name
    const description = body.description
    if (checkUndefined(name) || checkUndefined(description)){
        throw errors.INVALID_PARAMETER(`name or description`)
    }
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToEdit, mode)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToEdit}`)
    }
    return groupsData.editGroup(name, description,group, mode)
}


async function getGroupDetails(userToken, groupToGet){
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToGet, mode)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToGet}`)
    }
    const result = await groupsData.getGroupDetails(group)
    return result
}


async function addMovie(userToken, groupToAdd, movieId){
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToAdd, mode)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToAdd}`)
    }
    const movie = await moviesData.getMovieById(movieId)
    if(movie.id === null) {
        throw errors.MOVIE_NOT_FOUND(`id`,`${movieId}`)
    }
    const result = await groupsData.addMovie(group, movie, mode)
    if(result == false){
        throw errors.INVALID_PARAMETER(`movieId or groupId, the movie already exists in the group`)
    }
    return result
}


async function removeMovie(userToken, groupRemove, movieId){
    const user = await groupsData.getUser(userToken, mode)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupRemove, mode)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupRemove}`)
    }
    const result = await groupsData.removeMovie(group, movieId, mode)
    if(result == false){
        throw errors.INVALID_PARAMETER(`movieId or groupId, the movie was not found in the group`)
    }
    return result
}


async function movieDetails(movieId){
    const movieDetails = await moviesData.getMovieDetails(movieId)
    return movieDetails
}


function checkLimit(limit) {
    if ((limit > 250 || limit < 0 || isNaN(limit))){
        throw errors.INVALID_PARAMETER(`limit`)
    }
}

function checkUndefined(parameter){
    if (parameter === '' || parameter === undefined) {
        return true
    }
}

}