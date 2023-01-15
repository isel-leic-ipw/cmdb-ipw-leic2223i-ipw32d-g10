import { randomUUID } from 'crypto'
import fetch from 'node-fetch'

const baseURL = "http://localhost:9200/"

//curl -X DELETE http://localhost:9200/base_users
//curl -X PUT http://localhost:9200/base_users
//curl -X PUT -d {\"username\":\"user1\",\"password\":\"1234\",\"token\":\"0b115b6e-8fcd-4b66-ac26-33392dcb9340\"} -H "Content-Type: application/json" http://localhost:9200/base_users/_doc/1

//curl -X DELETE http://localhost:9200/base_groups
//curl -X PUT http://localhost:9200/base_groups
//curl -X PUT -d "{\"userId\":\"1\",\"name\":\"group2\",\"description\":\"group 2 description\",\"movies\": [] }" -H "Content-Type: application/json" http://localhost:9200/base_groups/_doc/2

function createUser(username, password, mode){
    let userToken = randomUUID()
        const body = {
                username : username,
                password: password,
                token : userToken
            }
        return fetch(baseURL + `${mode}_users/_doc`, {
                method : "POST",
                body : JSON.stringify(body),
                headers : {
                    "Content-Type" : "application/json", 
                    "Accept" : "application/json"}
             })
             .then(response => response.json())
             .then(result => {return {id : result._id, username : username, password: password, token: userToken}})
    }

function getAllGroups(userId, mode){
        return fetch(baseURL + `${mode}_groups/_search?q=userId:"${userId}"`, {
            headers : {"Accept" : "application/json"}
        })
        .then(response => response.json())
        .then(body => getAllGroupsAux(userId, body.hits.hits))
}

function getAllGroupsAux(userId, body){
        let allGroups = []
        body.forEach(e => {
                let source = e._source
                let noMovies = (source.movies).length
                let group = {
                        groupId: e._id,
                        name: source.name,
                        description: source.description,
                        nºmovies: noMovies
                    }
                allGroups.push(group)
        })
        let result = {
                user: userId,
                allGroups: allGroups
            }
        return result
}


function createGroup(userId, name, description, mode){
        const body = {
            userId : userId,
            name: name,
            description: description,
            movies: []
        }
        return fetch(baseURL + `${mode}_groups/_doc`, {
            method : "POST",
            body : JSON.stringify(body),
            headers : {
                "Content-Type" : "application/json", 
                "Accept" : "application/json"}
         })
        .then(response => response.json())
        .then(result => {
            let newGroup = {
                userId: userId,
                groupId: result._id,
                name: name,
                description: description,
                movies: []
            }
            return newGroup})    
}

function deleteGroup(group, mode){
        fetch(baseURL + `${mode}_groups/_doc/${group.groupId}`, {
                method : "DELETE",
                headers : {"Accept" : "application/json"}
        })
        return group
}

function editGroup(name, description, groupToEdit, mode){
        const body = {
                doc : {
                name: name,
                description: description
                }
            }
        fetch(baseURL + `${mode}_groups/_update/${groupToEdit.groupId}`, {
            method : "POST",
            body : JSON.stringify(body),
            headers : {
                "Content-Type" : "application/json", 
                "Accept" : "application/json"}
         })
        return groupToEdit
}

function getGroupDetails(group){
    let arr = group.movies
    let totalDuration = 0
    arr.forEach(e => {
        totalDuration += e.durationMins
    })
    const finalGroup = {
        group,
        moviesTotalDuration: totalDuration
    }
    return finalGroup
}

function addMovie(group, movie, mode) {
    let arr = group.movies
    for(let i = 0; i < arr.length; i++){
        if(movie.id == arr[i].id){
            movie = null
            break
        }
    }
    if(movie == null){
        return false
    } else {
        arr.push(movie)
        const body = {
                doc : {
                movies: arr
                }
            }
        moviesAux(group, body, mode)
    }
    }  

function removeMovie(group, movieId, mode) {
        let arr = group.movies
        for(let i = 0; i < arr.length; i++){
            if(movieId == arr[i].id){
                if (i > -1) {
                    arr.splice(i, 1) 
                    movieId = null
                    break
                  }
        }
    }
        if(movieId == null){
            const body = {
                doc : {
                movies: arr
                }
            }
            moviesAux(group, body, mode)
        } else {
            return false
        }
}    

function moviesAux(group, body, mode) {
    fetch(baseURL + `${mode}_groups/_update/${group.groupId}`, {
        method : "POST",
        body : JSON.stringify(body),
        headers : {
            "Content-Type" : "application/json", 
            "Accept" : "application/json"}
     })
    return group
}


//Auxiliary functions
function getUser(userToken, mode){
        return fetch(baseURL + `${mode}_users/_search?q=token:"${userToken}"`, {
                headers : {"Accept" : "application/json"}
             })
            .then(response => response.json())
            .then(body => body.hits.hits.map(t => { return{id : t._id, username : t._source.username, token : userToken}})[0])
}  

function getUserByUsername(username){
    return fetch(baseURL + `base_users/_search?q=username:"${username}"`, {
            headers : {"Accept" : "application/json"}
         })
        .then(response => response.json())
        .then(body => body.hits.hits.map(t => { return{id : t._id, username : username, password : t._source.password, token : t._source.token}})[0])
}  

function getGroup(groupId, mode){
        return fetch(baseURL + `${mode}_groups/_doc/${groupId}`, {
                headers : {"Accept" : "application/json"}
             })
            .then(response => response.json())
            .then(body => {
                if (body._source == undefined){
                    return null
                } else {
                    const g =  body._source
                    return {
                        userId : g.userId,
                        groupId : groupId,
                        name : g.name,
                        description : g.description,
                        movies : g.movies
                    }
                }
            })
}

export const data = {
        createUser,
        getAllGroups,
        createGroup,
        deleteGroup,
        editGroup,
        getGroupDetails,
        addMovie,
        removeMovie,
        getUser,
        getUserByUsername,
        getGroup
}

export default data