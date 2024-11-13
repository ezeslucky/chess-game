const express = require('express')
const socket = require('socket.io')
const http = require('http')
const { Chess} = require('chess.js')
const path = require('path')
const { title } = require('process')
const { log } = require('console')


const app = express()

const server = http.createServer(app)
const io = socket(server)

const chess = new Chess()

let players = {}
let currentPlayer = "w"


app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))



app.get("/", (req,res)=>{
    res.render("index", {title: "Chess Game"})
})


io.on("connection", function(uniqusocket){
    console.log("connected")

  if(!players.white){
    players.white = uniqusocket.id
    uniqusocket.emit("playerRole", "w")
  }
  else if(!players.black){
    players.black = uniqusocket.id
    uniqusocket.emit("playerRole", "b")
  }
  else{
    uniqusocket.emit("spectorRole")
  }

  uniqusocket.on("disconnect", function(){
    if(uniqusocket.id === players.white){
     delete players.white
    }
    else if(uniqusocket.id === players.black){
      delete players.black
    }
  })


uniqusocket.on("move",(move)=>{
  try {
    if(chess.turn() == 'w' && socket.id != players.white) return
    if(chess.turn() == 'b' && socket.id != players.black) return


  const result =  chess.move(move)
  if(result){
    currentPlayer = chess.turn()
    io.emit("move", move)
    io.emit("boardState", chess.fen())
  }
  else{
    console.log("Invalid Move :", move)
    uniqusocket.emit("invalidMove", move)
  }
  } catch (error) {
    console.log(error)
      uniqusocket.emit("Invalid move:", move)
    
  }
})

})


server.listen(3000, function (){
    console.log("listing on port 3000")
})