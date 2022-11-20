import express from 'express'

import * as moviesData from './cmdb-movies-data.mjs'
import * as groupsData from './cmdb-data-mem.mjs'
import cmdbServicesInit from './cmdb-services.mjs'
import cmdbApiInit from './cmdb-web-api.mjs'

import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'

const cmdbServices = cmdbServicesInit(groupsData, moviesData)
const cmdbApi = cmdbApiInit(cmdbServices)

const swaggerDocument = yaml.load('./docs/cmdb-api-spec.yaml')
const PORT = 8080

console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())


app.get('/topMovies', cmdbApi.getTopMovies)
app.get('/searchMovie/:movieName', cmdbApi.getMovie)
app.get('/groups', cmdbApi.getAllGroups)
app.post('/groups', cmdbApi.createGroup)
app.delete('/groups/:groupId', cmdbApi.deleteGroup)
app.get('/groups/:groupId', cmdbApi.getGroupDetails)
app.put('/groups/:groupId', cmdbApi.editGroup)
app.post('/groups/:groupId', cmdbApi.addMovie)
app.delete('/groups/:groupId/:movieId', cmdbApi.removeMovie)
app.post('/user', cmdbApi.createUser)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("End setting up server")