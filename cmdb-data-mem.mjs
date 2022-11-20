import { randomUUID } from 'crypto'

let users = []
let groups = []
let userId = 1
let groupId = 1

export async function createUser(userName){
    let userToken = randomUUID()
    users.forEach(e => {
        if(userToken == e.token){
            userToken = randomUUID()
        }
    })
    const user = {
        id: userId,
        userName: userName,
        token: userToken
    }
    users.push(user)
    userId++
    return user
}

export async function getAllGroups(userId){
    let allGroups = []
    groups.forEach(e => {
        if(e.userId == userId){
        let noMovies = (e.movies).length
        let group = {
            groupId: e.groupId,
            name: e.name,
            description: e.description,
            nºmovies: noMovies
        }
        allGroups.push(group)
        }
    })
    let result = {
        user: userId,
        allGroups: allGroups
    }
    return result
}

export async function createGroup(userId, name, description){
    let newGroup = {
        userId: userId,
        groupId: groupId,
        name: name,
        description: description,
        movies: []
    }
    groups.push(newGroup)
    groupId++
    return newGroup
}

export async function deleteGroup(group){
    const index = groups.indexOf(group)
    if (index > -1) {
        groups.splice(index, 1) 
      }
    return group  
}

export async function editGroup(groupToEdit, name, description){
    groupToEdit.name = name
    groupToEdit.description = description
    return groupToEdit
}

export async function getGroupDetails(group){
    let arr = group.movies
    let totalDuration = 0
    arr.forEach(e => {
        totalDuration += e.durationMins
    })
    const finalGroup = {
        group: group,
        moviesTotalDuration: totalDuration
    }
    return finalGroup
}

export async function addMovie(group, movie) {
    let arr = group.movies
    arr.forEach(e => {
        if(movie.id == e.id){
            movie = null
        }
    })
    if(movie == null){
        return false
    } else {
        arr.push(movie)
        return group
    }
}

export async function removeMovie(group, movieId) {
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
        return group
    } else {
        return false
    }
}

export async function getUser(userToken) {
    return users.find(user => user.token == userToken)
}

export async function getGroup(groupId, userId) {
    return groups.find(group => group.groupId == groupId && group.userId == userId)
}