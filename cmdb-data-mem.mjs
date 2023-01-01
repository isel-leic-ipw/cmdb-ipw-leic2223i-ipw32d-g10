import { randomUUID } from 'crypto'

const users = [{id: 1, username: 'buser1', token: '0b115b6e-8fcd-4b66-ac26-33392dcb9340'}]
const groups = [{userId: 1, groupId: 1, name: 'group1', description: 'group 1 description', movies: [
    {id: 'tt0111161', title: 'The Shawshank Redemption', year: '1994', durationMins: 120}, 
    {id: 'tt0468569', title: 'The Dark Knight', year: '2008', durationMins: 160}]},
{userId: 1, groupId: 2, name: 'group2', description: 'group 2 description', movies: []},
{userId: 1, groupId: 3, name: 'group3', description: 'group 3 description', movies: []}]

let userId = users.length + 1
let groupId = groups.length + 1

export async function createUser(userName){
    let userToken = randomUUID()
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
    const deletedGroup = groups[index]
    if (index > -1) {
        groups.splice(index, 1) 
      }
    return deletedGroup
}

export async function editGroup(name, description,groupToEdit){
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

//Auxiliary functions
export async function getUser(userToken) {
    return users.find(user => user.token == userToken)
}

export async function getGroup(groupId) {
    //return groups.find(group => group.groupId == groupId && group.userId == userId)
    return groups.find(group => group.groupId == groupId)
}