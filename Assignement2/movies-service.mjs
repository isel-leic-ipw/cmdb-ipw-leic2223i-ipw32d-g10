import data from './movies-data-mem.mjs'


function getMovies(token){
    //TODO verify if userToken is not undefined
    //TODO verify if userToken is associated to user
    //TODO tasks of user
    return data.getUserByToken(token)
            .then(user => data.getTasksByUserId(user.id))
}

 
 function searchMovieID(id, token){
    //TODO verify if id and token are not undefined 
    //TODO verify if userToken is associated to user
    //TODO get user task
    //TODO verify if user is owner
    return data.getMovieById(id)
 }
 
 function createGroup(text, token){
    //TODO verify if text and token are not undefined
    //TODO verify if token is associated with user
    return data.getUserByToken(token)
        .then(user => data.createGroup(text, user.id))
 }
 
 export const services ={
    getMovies,
     searchMovieID,
     createGroup
 }
 
 export default services