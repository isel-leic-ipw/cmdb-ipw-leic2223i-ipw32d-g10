export default function(services) {

    const token = '0b115b6e-8fcd-4b66-ac26-33392dcb9340'

    async function home(req, resp) {
        resp.render('home', {home: true, username : getUserName(req)})
    }

    async function getCreateUser(req, resp) {
        resp.render('register', {register: true})
    }

    async function createUser(req, resp) {
        await services.createUser(req.body.username, req.body.password)
        resp.redirect('/')
    }

    async function getCreateGroupForm(req, resp) {
        resp.render('newGroup', {createGroup: true, username : getUserName(req)})
    }

    function getSearchPageTop(req, res) {
		res.render('search', {searchTop: true, username : getUserName(req)});
	} 

    function getSearchPageMovies(req, res) {
		res.render('search', {search: true, username : getUserName(req)});
	} 

    async function getEditGroupForm(req, resp) {
        const id = req.params.groupId
        resp.render('newGroup', {id: id, editGroup: true, username : getUserName(req)})
    }

    async function getTopMovies(req, resp){
        const limit = req.query.limit
        const movies = await services.getTopMovies(limit)
        resp.render('movies', {topM: movies, topMovies: true, username : getUserName(req)})
    }

    async function getMovie(req, resp){
        const name = req.query.movie
        const limit = req.query.q
        const movies = await services.getMovie(name, limit)
        resp.render('movies', {m: movies, movies: true, username : getUserName(req)})
    }

    async function getAllGroups(req, resp) {
        const groups = await services.getAllGroups(getToken(req))
        resp.render('groups', {g: groups.allGroups, groups: true, username : getUserName(req)})
    }

    async function getGroupDetails(req, resp) {
        const group = await services.getGroupDetails(getToken(req), req.params.groupId)
        return resp.render('groupDetails', {gD: group, username : getUserName(req)})
    }

    async function editGroup(req, resp) {  
        await services.editGroup(getToken(req), req.params.groupId, req.body)
        resp.redirect('/groups')
    }

    async function createGroup(req, resp) {
        await services.createGroup(getToken(req), req.body)
        resp.redirect('/groups')
    }

    async function deleteGroup(req, resp) {
        await services.deleteGroup(getToken(req), req.params.groupId)
        resp.redirect('/groups')
    }

    async function add(req, resp) {
        const movieId = req.params.movieId
        const groups = await services.getAllGroups(getToken(req))
        resp.render('chooseGroup', {chooseG: groups.allGroups, movie: movieId, username : getUserName(req)})
    }

    async function addMovie(req, resp) {
        const movieId = req.params.movieId
        const group = req.params.groupId
        await services.addMovie(getToken(req), group, movieId)
        resp.redirect('/groups/' + group)
    }

    async function removeMovie(req, resp) {
        const movieId = req.params.movieId
        const group = req.params.groupId
        await services.removeMovie(getToken(req), group, movieId)
        resp.redirect('/groups/' + group)
}

async function movieDetails(req, resp) {
    const movieId = req.params.movieId
    const details = await services.movieDetails(movieId)
    resp.render('movieDetails', {details: details, username : getUserName(req)})
}

function getToken(req) {
    return req.user && req.user.token;
}

function getUserName(req) {
    return req.user && req.user.username;
}

return {
    home,
    getCreateUser,
    createUser,
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