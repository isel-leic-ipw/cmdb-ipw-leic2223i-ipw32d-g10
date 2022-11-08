import express from 'express'
import webapi from './movies-webapi.mjs'

const port = 8080
const app = express()

app.use(express.json())

app.get("/movies", webapi.getMovies)
app.get("/movies/:movieID", webapi.searchMovieID)

app.post("/movies", webapi.createGroup)
app.put("/movies/:groupID", webapi.editGroup)
add.put("/movies/:groupID/:movieID", webapi.addMovie)

app.get("/movies/:groupsID", webapi.listAll)
app.get("/movies/:groupsID", webapi.groupDetails)

app.delete("/movies/:groupsID/:movieID", webapi.removeMovie)
app.delete("/movies/:groupsID", webapi.deleteGroup)




app.listen(port, ()=>console.log("Listening..."))
