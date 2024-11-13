

const socket = io();
const  chess = new Chess()
const borderElement = document.querySelector(".chessboard")



let draggedPices = null
let sourceSquare  = null 
let playerRole = null 


const renderBoard = ()=>{
    const board = chess.board()
    borderElement.innerHTML = ""
   board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement =   document.createElement("div")
      squareElement.classList.add("square",
(rowindex + squareindex) % 2 === 0 ? "light" : "dark"

      )

      squareElement.dataset.row = rowindex
      squareElement.dataset.col = squareindex


      if(square){
        const pieceElement = document.createElement("div")
        pieceElement.classList.add("piece", square.color === 'w'? "white": "black")
        pieceElement.innerText = ""
        pieceElement.draggable = playerRole === square.color

        pieceElement.addEventListener("dragstart", (e)=>{
            if(pieceElement.draggable){
                draggedPices = pieceElement
                sourceSquare = {row: rowindex , col: squareindex}
                e.dataTransfer.setData("text/plain", "")
            }
        })

        pieceElement.addEventListener("dragend", (e)=>{
            draggedPices = null
            sourceSquare = null
        })

        squareElement.appendChild(pieceElement)
      }

      squareElement.addEventListener("dragover", function (e){
e.preventDefault()
      })

      squareElement.addEventListener("drop", function(e){
        e.preventDefault()
        if(draggedPices){
            const targetSource ={
                row: parseInt(squareElement.dataset.row),
                col: parseInt(squareElement.dataset.col)
            }

            handleMove(sourceSquare, targetSource)
        }
      })
      borderElement.appendChild(squareElement)
    })
   });

   
}

const handleMove = ()=>{}

const getpieceUnicode = ()=> {}

renderBoard()