import request from 'supertest'
import express from 'express'
import {expect} from 'chai'

import * as moviesData from '../cmdb-movies-data.mjs'
import data from '../cmdb-db-elastic.mjs'
import servicesFunction from '../cmdb-services.mjs'
import webApiFunction from '../cmdb-web-api.mjs'

const services = servicesFunction(data, moviesData, "test")
const webapi = webApiFunction(services)
const token = "0b115b6e-8fcd-4b66-ac26-33392dcb9340"

const app = express()

app.use(express.json())
app.get('/api/topMovies', webapi.getTopMovies)
app.get('/api/searchMovie/:movieName', webapi.getMovie)

app.get('/api/groups', webapi.getAllGroups)
app.post('/api/groups', webapi.createGroup)
app.delete('/api/groups/:groupId', webapi.deleteGroup)
app.get('/api/groups/:groupId', webapi.getGroupDetails)
app.put('/api/groups/:groupId', webapi.editGroup)
app.post('/api/groups/:groupId', webapi.addMovie)
app.delete('/api/groups/:groupId/:movieId', webapi.removeMovie)
app.post('/api/user', webapi.createUser)

//curl -X DELETE http://localhost:9200/test_users
//curl -X PUT http://localhost:9200/test_users
//curl -X PUT -d {\"userName\":\"user1\",\"token\":\"0b115b6e-8fcd-4b66-ac26-33392dcb9340\"} -H "Content-Type: application/json" http://localhost:9200/test_users/_doc/1

//curl -X DELETE http://localhost:9200/test_groups
//curl -X PUT http://localhost:9200/test_groups
//curl -X PUT -d "{\"userId\":\"1\",\"name\":\"group2\",\"description\":\"group 2 description\",\"movies\": [] }" -H "Content-Type: application/json" http://localhost:9200/test_groups/_doc/2

describe('API Tests', () => {

  it('create group valid name,desc and token', () => {
    return request(app)
      .post('/api/groups')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({name : "group 1", description : "group 1 desc"})
      .expect(201)
      .then(response => expect(response.body.group.name).equal("group 1"))
})
it('create group not valid name/description', () => {
    return request(app)
      .post('/api/groups')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({name : "", description : "group 4 desc"})
      .expect(400)
      .then(response => expect(response.body.body).equal("Invalid argument name or description"))
})

    it('get all groups with valid token', () => {
        return request(app)
          .get('/api/groups')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => expect(response.body.groups).deep.equal(
            [{"groupId": "2","name": "group2","description": "group 2 description","nºmovies": 0}]))
    })
    it('get all groups with not valid token', () => {
        return request(app)
          .get('/api/groups')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer 12345`)
          .expect('Content-Type', /json/)
          .expect(401)
          .then(response => expect(response.body.body).equal("User not found"))
    })

    it('get group details with valid groupId', () => {
      return request(app)
        .get('/api/groups/2')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => expect(response.body.group.moviesTotalDuration).equal(0))
  })

  it('add movie to group', () => {
    return request(app)
      .post('/api/groups/2')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({movieId : "tt1375666"})
      .expect(201)
      .then(response => expect(response.body.status).deep.equal(
        "Movie with id tt1375666 added with success"))
})

  it('edit group', () => {
    return request(app)
      .put('/api/groups/2')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({name : "group 1", description : "group 1 desc"})
      .expect(201)
      .then(response => expect(response.body.status).deep.equal(
        "Group edited with success"))
})

    it('delete group that exists', () => {
        return request(app)
          .delete('/api/groups/2')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => expect(response.body.status).equal("Group with id 2 deleted"))
    })
    it('delete invalid group', () => {
        return request(app)
          .delete('/api/groups/10')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then(response => expect(response.body.body).equal("Group with id 10 not found"))
    })

    it('create user', () => {
      return request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send({userName : "user2"})
        .expect(201)
        .then(response => expect(response.body.user.userName).equal("user2"))
      })
});