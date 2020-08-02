//Project by moses with respects to TraversyMedia

//ensure code runs after html DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let squares = [];
  let mineCount = 20;
  let isGameOver = false;

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
    }

    //Get immediate mines number
    for (let i = 0; i < squares.length; i++) {
      let total = 0;

      //Get leftEdge and rightEdge squares
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === -1;

      //count mines around squares
      if (squares[i].classList.contains("safe")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (i > 9 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
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
      square.classList.contains("flaged")
    )
      return;
    if (square.classList.contains("bomb")) {
      alert("Game Over!");
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
      square.classList.add("checked");
    }
  }
});
