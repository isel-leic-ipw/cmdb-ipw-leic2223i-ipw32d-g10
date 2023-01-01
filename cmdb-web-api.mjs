import toHttpResponse from './errors/cmdb-http-errors.mjs'

export default function (cmdbServices) {
    return {
    getTopMovies: getTopMovies,
    getMovie: getMovie,
    createUser: createUser,
    getAllGroups: verifyAuthentication(getAllGroupsInternal),
    createGroup: verifyAuthentication(createGroupInternal),
    deleteGroup: verifyAuthentication(deleteGroupInternal),
    getGroupDetails: verifyAuthentication(getGroupDetailsInternal),
    editGroup: verifyAuthentication(editGroupInternal),
    addMovie: verifyAuthentication(addMovieInternal),
    removeMovie: verifyAuthentication(removeMovieInternal)
    }

async function getTopMovies(req, rsp){
    const limit = req.query.limit
    try {
        const movies = await cmdbServices.getTopMovies(limit)
        rsp
        .status(200)
        .json({
            status: `Most popular ${limit} movies found`,
            movies: movies
            })
    
    } catch(e) {
        let ret = toHttpResponse(e)
        rsp.status(ret.status).json(ret.body)
    }
}

async function getMovie(req, rsp){
    const name = req.params.movieName
    const limit = req.query.limit
    try {
        const movies = await cmdbServices.getMovie(name, limit)
        rsp
        .status(200)
        .json({
            status: `Movies with the name ${name} found`,
            movies: movies
        })
    } catch (e){
        let ret = toHttpResponse(e)
        rsp.status(ret.status).json(ret.body)
    }
}

async function createUser(req, rsp){
    const userName = req.body.userName
    try {
        const newUser = await cmdbServices.createUser(userName)
        rsp
        .status(201)
        .json({
            status: `User ${userName} was created`,
            user: newUser
        })
    } catch(e) {
        let ret = toHttpResponse(e)
        rsp.status(ret.status).json(ret.body)
    }
}

async function getAllGroupsInternal(req, rsp) {
    try {
        const groups = await cmdbServices.getAllGroups(req.token)
        rsp
        .status(200)
        .json({
            status: `Groups of the user with id ${groups.user} found`,
            groups: groups.allGroups
        })
    } catch(e) {
        let ret = toHttpResponse(e)
        rsp.status(ret.status).json(ret.body)
    }
}

async function createGroupInternal(req, rsp) {
    try {
        let newGroup = await cmdbServices.createGroup(req.token, req.body)
        rsp
            .status(201)
            .json({
                status: `Group with name ${req.body.name} created with success`,
                group: newGroup
                })
            
        } catch(e) {
            let ret = toHttpResponse(e)
            rsp.status(ret.status).json(ret.body)
        }
}

async function deleteGroupInternal(req, rsp) {
    const groupId = req.params.groupId
    try {
        const group = await cmdbServices.deleteGroup(req.token, groupId)
        rsp
        .status(200)
        .json({
            status: `Group with id ${groupId} deleted`,
            deletedgroup: group
        })
    } catch(e) {
        let ret = toHttpResponse(e)
        rsp.status(ret.status).json(ret.body)
    }
}

async function editGroupInternal(req, rsp) {
    const groupToEdit = req.params.groupId
    try {
        let editedGroup = await cmdbServices.editGroup(req.token, groupToEdit, req.body)
        rsp
            .status(201)
            .json({
                status: `Group edited with success`,
                group: editedGroup
                })
            
        } catch(e) {
            let ret = toHttpResponse(e)
            rsp.status(ret.status).json(ret.body)
        }
}

async function getGroupDetailsInternal(req, rsp) {
    const groupId = req.params.groupId
    try {
        let group = await cmdbServices.getGroupDetails(req.token, groupId)
        rsp
            .status(200)
            .json({
                status: `Group with id ${groupId} found`,
                group: group
                })
            
        } catch(e) {
            let ret = toHttpResponse(e)
            rsp.status(ret.status).json(ret.body)
        }
}

async function addMovieInternal(req, rsp) {
    const movieId = req.body.movieId
    const group = req.params.groupId
    try {
        let movie = await cmdbServices.addMovie(req.token, group, movieId)
        rsp
            .status(201)
            .json({
                status: `Movie with id ${movieId} added with success`,
                group: movie
                })
            
        } catch(e) {
            let ret = toHttpResponse(e)
            rsp.status(ret.status).json(ret.body)
        }
}

async function removeMovieInternal(req, rsp) {
    const movieId = req.params.movieId
    const group = req.params.groupId
    try {
        let movie = await cmdbServices.removeMovie(req.token, group, movieId)
        rsp
            .status(200)
            .json({
                status: `Movie with id ${movieId} removed`,
                group: movie
                })
            
        } catch(e) {
            let ret = toHttpResponse(e)
            rsp.status(ret.status).json(ret.body)
        }
}

function verifyAuthentication(handlerFunction) {
    return function(req, rsp) {
        //let userToken = '0b115b6e-8fcd-4b66-ac26-33392dcb9340'
        let userToken = req.get("Authorization")
        userToken = userToken ? userToken.split(" ")[1] : null
        if(!userToken) {
            return rsp
                    .status(401)
                    .json({error: `User token must be provided`})
        }
        req.token = userToken 
        handlerFunction(req, rsp)
    }
}
}