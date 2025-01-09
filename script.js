const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector("#message").innerHTML = message
  }
  const requiredMessage = (message) => {
    document.querySelector(".required").innerHTML = message
  }

  return {
    renderMessage,
    requiredMessage
  }
})();

const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""]

  const render = () => {
    let boardHTML = "";
    board.forEach((square, index) => {
      if(square == "O") {
        boardHTML += `<div style="color: #F2B137" class="square" id="square-${index}">${square}</div>`
      } else {
        boardHTML += `<div class="square" id="square-${index}">${square}</div>`
      }
    })
    document.querySelector("#gameboard").innerHTML = boardHTML;

    const squares = document.querySelectorAll(".square")
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick)
    })
  }

  const update = (index, value) => {
    board[index] = value;
    render()
  };  

  const getGameBoard = () => board;

  return {
    render,
    update,
    getGameBoard,
  }
})();

const createPlayer = (name, mark) => {
  return {
    name,
    mark
  }
}

const Game = (() => {
  let players = []
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O")
    ]

    currentPlayerIndex = 0;
    gameOver = false;
    GameBoard.render()
  }

  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    if(document.querySelector("#player1").value === "" || document.querySelector("#player2").value === "") {
      displayController.requiredMessage("Please enter your names")
      return;
    }

    displayController.requiredMessage("")

    let index = parseInt(event.target.id.split("-")[1]);

    if(GameBoard.getGameBoard()[index] !== "")
      return

    GameBoard.update(index, players[currentPlayerIndex].mark)

    if(checkForWin(GameBoard.getGameBoard(), players[currentPlayerIndex].mark)) {
      gameOver = true;
      displayController.renderMessage(`${players[currentPlayerIndex].name} won!`)
    } else if (checkForTie(GameBoard.getGameBoard())) {
      gameOver = true;
      displayController.renderMessage("It's a tie")
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  }

  const restart = () => {
    gameOver = false;
    for(let i = 0; i < 9; i++) {
      GameBoard.update(i, "")
    }
    currentPlayerIndex = 0;
    GameBoard.render()
    document.querySelector("#message").innerHTML = "Tic-Tac-Toe"
  }


  return {
    start,
    handleClick,
    restart,
  }
})();

function checkForWin(board) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < winCombinations.length; i++) {
    const [a, b, c] = winCombinations[i];
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every(cell => cell !== "")
}

const restartButton = document.querySelector("#restart-btn")
restartButton.addEventListener("click", () => {
  Game.restart();
  document.querySelector("#player1").value = ""
  document.querySelector("#player2").value = ""
})

const startButton = document.querySelector("#start-btn")
startButton.addEventListener("click", (event) => {
  event.preventDefault()
  if(document.querySelector("#player1").value !== "" && document.querySelector("#player2").value !== "") {
    displayController.requiredMessage("");
    Game.start();
  } else {
    displayController.requiredMessage("Please enter your names");
  }
  
})