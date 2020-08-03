//Project by moses with respects to TraversyMedia

//ensure code runs after html DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let squares = [];
  let mineCount = 20;
  let isGameOver = false;
  let flags = 0;

  //build minesweep board
  function buildBoard() {
    // create random mines within field
    const mines = Array(mineCount).fill("bomb");
    const safeZones = Array(width * width - mineCount).fill("safe");
    const field = safeZones.concat(mines);

    //shuffle mines and safezones to create the final playing field for players
    const playingField = field.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);

      //identify mines from safezones
      square.classList.add(playingField[i]);
      grid.appendChild(square);
      squares.push(square);

      //create listerner for each square
      square.addEventListener("click", function (e) {
        clicked(square);
      });

      //add flagged event handler
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //Get immediate mines number
    for (let i = 0; i < squares.length; i++) {
      let total = 0;

      //Get leftEdge and rightEdge squares
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      //count mines around squares
      if (squares[i].classList.contains("safe")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
        squares[i].setAttribute("data", total);
      }
    }
  }
  buildBoard();

  //"clicked" listener function
  function clicked(square) {
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flagged")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square);
    }
    square.classList.add("checked");
  }

  //Add flag upon right clicking
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < mineCount) {
      if (!square.classList.contains("flagged")) {
        square.classList.add("flagged");
        square.innerHTML = "🚩";
        flags++;
        winCheck();
      } else {
        square.classList.remove("flagged");
        square.innerHTML = "";
        flags--;
      }
    }
  }

  //Recursively check neighbouring squres upon safe square click
  function checkSquare(square) {
    const isLeftEdge = square.id % width === 0;
    const isRightEdge = square.id % width === width - 1;

    setTimeout(() => {
      if (square.id > 0 && !isLeftEdge) {
        const newId = squares[parseInt(square.id) - 1].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id > 9 && !isRightEdge) {
        const newId = squares[parseInt(square.id) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id > 10) {
        const newId = squares[parseInt(square.id) - width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id > 11 && !isLeftEdge) {
        const newId = squares[parseInt(square.id) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id < 98 && !isRightEdge) {
        const newId = squares[parseInt(square.id) + 1].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id < 90 && !isLeftEdge) {
        const newId = squares[parseInt(square.id) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id < 88 && !isRightEdge) {
        const newId = squares[parseInt(square.id) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }

      if (square.id < 89) {
        const newId = squares[parseInt(square.id) + width].id;
        const newSquare = document.getElementById(newId);
        clicked(newSquare);
      }
    }, 10);
  }

  //"gameOver" function, user tripped a mine
  function gameOver(square) {
    alert("GameOver");
    isGameOver = true;

    //reveal all mines
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  // Win Check function
  function winCheck() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flagged") &&
        squares[i].classList.contains("bomb")
      )
        matches++;
      if (matches === mineCount) {
        alert("You Win!");
        isGameOver = true;
      }
    }
  }
});
