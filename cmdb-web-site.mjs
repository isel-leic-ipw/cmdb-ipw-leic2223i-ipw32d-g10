export default function(services) {

    const token = '0b115b6e-8fcd-4b66-ac26-33392dcb9340'
    
    /*function verifyAuthentication(handlerFunction) {
        return function(req, rsp) {
            let userToken = setUserToken(req)
            //userToken = userToken ? userToken.split(" ")[1] : null
            if(!userToken) {
                return rsp
                        .status(401)
                        .json({error: `User token must be provided`})
            }
            //req.token = userToken 
            handlerFunction(req, rsp)
        }
    } */ 

    async function home(req, resp) {
        resp.render('home', {home: true})
    }

    async function getCreateGroupForm(req, resp) {
        resp.render('newGroup', {createGroup: true})
    }

    function getSearchPageTop(req, res) {
		res.render('search', {searchTop: true});
	} 

    function getSearchPageMovies(req, res) {
		res.render('search', {search: true});
	} 

    async function getEditGroupForm(req, resp) {
        const id = req.params.groupId
        resp.render('newGroup', {id: id, editGroup: true})
    }

    async function getTopMovies(req, resp){
        const limit = req.query.limit
        const movies = await services.getTopMovies(limit)
        resp.render('movies', {topM: movies, topMovies: true})
    }

    async function getMovie(req, resp){
        const name = req.query.movie
        const limit = req.query.q
        const movies = await services.getMovie(name, limit)
        resp.render('movies', {m: movies, movies: true})
    }

    async function getAllGroups(req, resp) {
        const groups = await services.getAllGroups(token)
        resp.render('groups', {g: groups.allGroups, groups: true})
    }

    async function getGroupDetails(req, resp) {
        const group = await services.getGroupDetails(token, req.params.groupId)
        return resp.render('groupDetails', {gD: group})
    }

    async function editGroup(req, resp) {  
        await services.editGroup(token, req.params.groupId, req.body)
        resp.redirect('/groups')
    }

    async function createGroup(req, resp) {
        await services.createGroup(token, req.body)
        resp.redirect('/groups')
    }

    async function deleteGroup(req, resp) {
        await services.deleteGroup(token, req.params.groupId)
        resp.redirect('/groups')
    }

    async function add(req, resp) {
        const movieId = req.params.movieId
        const groups = await services.getAllGroups(token)
        resp.render('chooseGroup', {chooseG: groups.allGroups, movie: movieId})
    }

    async function addMovie(req, resp) {
        const movieId = req.params.movieId
        const group = req.params.groupId
        await services.addMovie(token, group, movieId)
        resp.redirect('/groups/' + group)
    }

    async function removeMovie(req, resp) {
        const movieId = req.params.movieId
        const group = req.params.groupId
        await services.removeMovie(token, group, movieId)
        resp.redirect('/groups/' + group)
}

async function movieDetails(req, resp) {
    const movieId = req.params.movieId
    const details = await services.movieDetails(movieId)
    resp.render('movieDetails', {details: details})
}

return {
    home,
    getCreateGroupForm,
    getSearchPageTop,
    getSearchPageMovies,
    getEditGroupForm,
    getTopMovies,
    getMovie,
    getAllGroups,
    getGroupDetails,
    editGroup,
    createGroup,
    deleteGroup,
    add,
    addMovie,
    removeMovie,
    movieDetails
}

}