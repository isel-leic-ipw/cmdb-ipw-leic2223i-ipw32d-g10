const users = [
    {id : 11, userName : "Spongebob", token : "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    {id : 12, userName : "Willem", token : "3fa85f64-5717-4562-b3fc-2c963f66afa7" }
]

const movies = [
    {id : tt0111161, fullTitle : "movie", runTime: 25},
    {id : tt0468569, fullTitle : "book", runTime: 46},
]

const groups = [
    {id : 1, name: "group1", description: "I like movies", movies:["movie1","movie2"], totalDuration: 420},
    {id : 2, name: "group2", description: "I hate movies", movies:["NotAmovie","BookCase"], totalDuration: 69}
]

//TODO ERRORS

let nextGroupId = 3

function getUserByToken(token){
    const user = users.find(u => u.token == token)
    if(!user) return Promise.reject({message : "Not Found"})
    return Promise.resolve(user)
}


function getMovieById(id){
   return Promise.resolve(movies.find( m => m.id == id))
}

function createGroup(n, d, m, tD ){
    const group = {id : nextGroupId , name : n, description: d, movies : m, totalDuration: tD}
    groups.push(group)
    ++nextTaskId
    return Promise.resolve(group)
}

export const data ={
    getUserByToken,
    createGroup,
    getMovieById,
}

export default data