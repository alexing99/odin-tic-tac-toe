const displayController = (() => {
  //module for the display message
  const renderMessage = (message) => {
    //function for rendering the message
    document.querySelector("#message").innerHTML = message; //grabbing the div and putting in message from the above functions parameter
  };
  return {
    renderMessage,
  };
})();

const gameboard = (() => {
  // module for the gameboard
  let gameboard = ["", "", "", "", "", "", "", "", ""]; // creating the array with 9 spots

  const render = () => {
    // function for rendering the squares
    let boardHTML = ""; // initializes square's content
    gameboard.forEach((square, index) => {
      // function applied to each element of array
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`; // creates divs for each element in the array
    });
    document.querySelector("#gameboard").innerHTML = boardHTML; //puts the divs into the parent div
    const squares = document.querySelectorAll(".square"); // selects the individual divs that were just created
    squares.forEach((square) => {
      // loops through them
      square.addEventListener("click", Game.handleClick); // adds event listener set to the function handleclick
    });
    console.log(document.querySelector(".count1"));

    if (!gameboard.every((cell) => cell === "")) {
      const count1 = document.querySelector(".count1");
      count1.innerHTML = Game.getCount0();
      const count2 = document.querySelector(".count2");
      count2.innerHTML = Game.getCount1();
    }
    // if (getPlayerIndex() === 0) {
    //   document.querySelector("#override-counter-1").style.border = "blue solid";
    //   document.querySelector("#override-counter-2").style.border = "solid";
    // }
    // if (getPlayerIndex() === 1)
    //   document.querySelector("#override-counter-2").style.border = "blue solid";
    // document.querySelector("#override-counter-1").style.border = "solid";
  };

  const update = (index, value) => {
    // updates and rerenders the board
    gameboard[index] = value;
    render();
  };

  const getGameboard = () => gameboard; // way of indirectly accessing whats inside of gameboard. this function (called an accessory). Gives you access but cannot modify it. Used in the checkforwin function.

  return {
    render,
    update,
    getGameboard,
  };
})();

const playerFact = (name, mark) => {
  // factory for creating players
  return {
    name,
    mark,
  };
};
const Game = (() => {
  // module for the gameplay
  let players = []; // array for the 2 players
  let currentPlayerIndex; // keeps track of turn
  let gameOver; // establishes the end of the game

  const start = () => {
    // function for starting the game
    players = [
      // takes the inputs and puts them into the array with name and mark
      playerFact(document.querySelector("#player1").value, "X"),
      playerFact(document.querySelector("#player2").value, "O"),
    ];
    overCount0 = 3;
    overCount1 = 3;
    currentPlayerIndex = 0;
    gameOver = false;
    gameboard.render(); // makes the board
    const squares = document.querySelectorAll(".square"); // selects for all squares
    squares.forEach((square) => {
      square.addEventListener("click", handleClick); // there are two event listener things bc u need to initialize it and then the other is to keep them when rerendereing and updating
    });
    document.querySelector("#override-counter-1").textContent =
      document.querySelector("#player1").value + " -" + " X";
    document.querySelector("#override-counter-1").style.border =
      "green solid 5px";

    document.querySelector("#override-counter-2").textContent =
      document.querySelector("#player2").value + " -" + " O";
    document.querySelector("#override-counter-2").style.border = "solid";
    const overrideCounter1 = document.querySelector("#override-counter-1");
    const count1 = document.createElement("p");
    count1.innerHTML = overCount0;
    count1.classList.add("count1");
    overrideCounter1.appendChild(count1);
    const overrideCounter2 = document.querySelector("#override-counter-2");
    const count2 = document.createElement("p");
    count2.innerHTML = overCount1;
    count2.classList.add("count2");
    overrideCounter2.appendChild(count2);
  };

  const handleClick = (event) => {
    // function for what to do when its clicked
    let index = parseInt(event.target.id.split("-")[1]); // isolates and converts the number of the index
    if (gameboard.getGameboard()[index] !== "")
      if (currentPlayerIndex === 1 && getCount1() === 0) {
        return;
      } else if (currentPlayerIndex === 0 && getCount0() === 0) {
        return;
      } else if (currentPlayerIndex === 0) {
        overCount0 = overCount0 - 1;
      } else if (currentPlayerIndex === 1) {
        overCount1 = overCount1 - 1;
      }

    gameboard.update(index, players[currentPlayerIndex].mark); // update the board with the index clicked and the mark of whoever's turn it is

    if (
      // if checkForwin is true then display message
      checkForWin(gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      console.log(gameboard.getGameboard());
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} WINS!`
      );
      if (currentPlayerIndex === 0) {
        document.querySelector("#override-counter-1").style.border =
          "gold solid 5px";
      } else if (currentPlayerIndex === 1) {
        document.querySelector("#override-counter-2").style.border =
          "gold solid 5px";
      }
      const squares = document.querySelectorAll(".square"); // stops play after win
      squares.forEach((square) => {
        square.removeEventListener("click", handleClick);
      });
    } else if (checkForTie(gameboard.getGameboard())) {
      // else if checkfortie is true then display message
      gameOver = true;
      displayController.renderMessage("IT'S A TIE!");
      document.querySelector("#override-counter-1").style.border =
        "red solid 5px";
      document.querySelector("#override-counter-2").style.border =
        "red solid 5px";
      const squares = document.querySelectorAll(".square"); // stops play after tie
      squares.forEach((square) => {
        square.removeEventListener("click", handleClick);
      });
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; // switches players after turns. if 0 it becomes 1 and if 1 it becomes 0
    console.log(currentPlayerIndex);
    if (gameOver === false && currentPlayerIndex === 0) {
      document.querySelector("#override-counter-1").style.border =
        "green solid 5px";
      document.querySelector("#override-counter-2").style.border = "solid";
    } else if (gameOver === false && currentPlayerIndex === 1) {
      document.querySelector("#override-counter-2").style.border =
        "green solid 5px";
      document.querySelector("#override-counter-1").style.border = "solid";
    }
  };

  const restart = () => {
    // function for the restart button
    for (let i = 0; i < 9; i++) {
      // updates all the squares individually with the update function
      gameboard.update(i, "");
    }
    Game.start();
    gameboard.render();
    gameOver = false;
    document.querySelector("#message").innerHTML = "";
  };

  const getCount0 = () => overCount0;
  const getCount1 = () => overCount1;
  //   const getPlayerIndex = () => currentPlayerIndex;

  //   const checkOveride = () => {
  //     if (overCount != 0 && getGameboard().index != '')

  //   }

  return {
    start,
    handleClick,
    restart,
    getCount0,
    getCount1,
    // getPlayerIndex,
    // checkOveride,
  };
})();

function checkForWin(board) {
  // board is getgameboard later
  const winningCombinations = [
    // array of arrays
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    // loops through
    const [a, b, c] = winningCombinations[i]; // assigns the current winningcombo array as a, b, and c. so you can check those specific index numbers with your boards array.
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // so if a, b, and c are all the same. board become gameboard when you call it. the first board[a] is to check if there is anything there bc you could then win by having 3 in a row of nothing.
      return true;
    }
  }
}

function checkForTie(board) {
  return board.every((cell) => cell !== ""); // if every cell is taken and no winner. cell can be any word it just represents the element in an array.
}

const restartButton = document.querySelector("#restart-button"); // selects and adds event listener to restart button
restartButton.addEventListener("click", () => {
  Game.restart();
});

const startButton = document.querySelector("#start-button"); // selects and adds event listener to start button
startButton.addEventListener("click", () => {
  Game.start();
});
