import errors from './errors/cmdb-errors.mjs'

export default function(groupsData, moviesData) {
    if (!groupsData) {
        throw errors.INVALID_PARAMETER('groupsData')
    }
    if (!moviesData) {
        throw errors.INVALID_PARAMETER('moviesData')
    }
    return {
        getTopMovies: getTopMovies,
        getMovie: getMovie,
        createUser: createUser,
        getAllGroups: getAllGroups,
        createGroup: createGroup,
        deleteGroup: deleteGroup,
        editGroup: editGroup,
        getGroupDetails: getGroupDetails,
        addMovie: addMovie,
        removeMovie: removeMovie
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


async function createUser(userName){
    if (checkUndefined(userName)) {
        throw errors.INVALID_PARAMETER(`userName`)
    }
    return groupsData.createUser(userName)
}


async function getAllGroups(userToken){
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    return groupsData.getAllGroups(user.id)
}


async function createGroup(userToken, body){
    const name = body.name
    const description = body.description
    if (checkUndefined(name) || checkUndefined(description)){
        throw errors.INVALID_PARAMETER(`name or description`)
    }
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    return groupsData.createGroup(user.id, name, description)
}


async function deleteGroup(userToken, groupToDelete){ 
    checkGroupId(groupToDelete)
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToDelete, user.id)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToDelete}`)
    }
    return groupsData.deleteGroup(group)
}


async function editGroup(userToken, groupToEdit, body){
    const name = body.name
    const description = body.description
    checkGroupId(groupToEdit)
    if (checkUndefined(name) || checkUndefined(description)){
        throw errors.INVALID_PARAMETER(`name or description`)
    }
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToEdit, user.id)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToEdit}`)
    }
    return groupsData.editGroup(group, name, description)
}


async function getGroupDetails(userToken, groupToGet){
    checkGroupId(groupToGet)
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToGet, user.id)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToGet}`)
    }
    const result = await groupsData.getGroupDetails(group)
    return result
}


async function addMovie(userToken, groupToAdd, movieId){
    checkGroupId(groupToAdd)
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupToAdd, user.id)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupToAdd}`)
    }
    const movie = await moviesData.getMovieById(movieId)
    if(movie.id === null) {
        throw errors.MOVIE_NOT_FOUND(`id`,`${movieId}`)
    }
    const result = await groupsData.addMovie(group, movie)
    if(result == false){
        throw errors.INVALID_PARAMETER(`movieId or groupId, the movie already exists in the group`)
    }
    return result
}


async function removeMovie(userToken, groupRemove, movieId){
    checkGroupId(groupRemove)
    const user = await groupsData.getUser(userToken)
    if(!user) {
        throw errors.USER_NOT_FOUND()
    }
    const group = await groupsData.getGroup(groupRemove, user.id)
    if(!group) {
        throw errors.GROUP_NOT_FOUND(`${groupRemove}`)
    }
    const result = await groupsData.removeMovie(group, movieId)
    if(result == false){
        throw errors.INVALID_PARAMETER(`movieId or groupId, the movie was not found in the group`)
    }
    return result
}


function checkLimit(limit) {
    if ((limit > 250 || limit < 0 || isNaN(limit))){
        throw errors.INVALID_PARAMETER(`limit`)
    }
}

function checkGroupId(id) {
    if(isNaN(id)){
        throw errors.INVALID_PARAMETER(`groupId`)
    }
}

function checkUndefined(parameter){
    if (parameter === '' || parameter === undefined) {
        return true
    }
}

}