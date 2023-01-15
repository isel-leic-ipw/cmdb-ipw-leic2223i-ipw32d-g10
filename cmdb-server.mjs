import express from 'express'

import * as moviesData from './cmdb-movies-data.mjs'
import * as groupsData from './cmdb-data-mem.mjs'
import data from './cmdb-db-elastic.mjs'
import cmdbServicesInit from './cmdb-services.mjs'
import cmdbApiInit from './cmdb-web-api.mjs'
import cmdbWebSiteInit from './cmdb-web-site.mjs'
import authUIFunction from './cmdb-user-site.mjs'

import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import path from 'path';
import { fileURLToPath } from 'url';
import hbs from 'hbs';

const cmdbServices = cmdbServicesInit(data, moviesData, "base")
const authRouter = authUIFunction(cmdbServices)
const cmdbApi = cmdbApiInit(cmdbServices)
const cmdbWebSite = cmdbWebSiteInit(cmdbServices)

const swaggerDocument = yaml.load('./docs/cmdb-api-spec.yaml')
const PORT = 8080

console.log("Start setting up server")
let app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/public', express.static('imgs'));
app.use(express.json())
app.use(express.urlencoded())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use("/api",authorizationMw)

app.use(authRouter)

//Api paths and functions
app.get('/api/topMovies', cmdbApi.getTopMovies)
app.get('/api/searchMovie/:movieName', cmdbApi.getMovie)
app.get('/api/groups', cmdbApi.getAllGroups)
app.post('/api/groups', cmdbApi.createGroup)
app.delete('/api/groups/:groupId', cmdbApi.deleteGroup)
app.get('/api/groups/:groupId', cmdbApi.getGroupDetails)
app.put('/api/groups/:groupId', cmdbApi.editGroup)
app.post('/api/groups/:groupId', cmdbApi.addMovie)
app.delete('/api/groups/:groupId/:movieId', cmdbApi.removeMovie)
app.post('/api/user', cmdbApi.createUser)


//WebSite paths and functions
app.get('/', cmdbWebSite.home)

app.get('/register', cmdbWebSite.getCreateUser)

app.get('/groups/create', cmdbWebSite.getCreateGroupForm)
app.get('/groups/:groupId/edit', cmdbWebSite.getEditGroupForm)          
app.get('/search', cmdbWebSite.getSearchPageMovies)
app.get('/searchTopMovies', cmdbWebSite.getSearchPageTop)
app.get('/topMovies', cmdbWebSite.getTopMovies)
app.get('/searchMovie', cmdbWebSite.getMovie)
app.get('/groups', cmdbWebSite.getAllGroups)
app.get('/groups/:groupId', cmdbWebSite.getGroupDetails)       

app.post('/groups/:groupId/delete', cmdbWebSite.deleteGroup)

app.post('/createUser', cmdbWebSite.createUser)
app.post('/groups/:groupId/update', cmdbWebSite.editGroup)   
app.post('/groups', cmdbWebSite.createGroup)

app.get('/add/:movieId', cmdbWebSite.add)
app.post('/add/:movieId/:groupId', cmdbWebSite.addMovie)

app.post('/groups/:groupId/:movieId', cmdbWebSite.removeMovie)
app.get('/:movieId', cmdbWebSite.movieDetails)

function authorizationMw(req, rsp, next) {
    console.log('authorizationMw', req.get('Authorization'))
    if(req.get('Authorization')){
            req.user = {
            token: req.get('Authorization').split(' ')[1]
        }
        
    }
    next()
}

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("End setting up server")