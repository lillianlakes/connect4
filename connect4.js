"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

const restart = document.querySelector('#restart');

const playAgain = new CustomConfirm();

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // creates a top row with an event listener on each cell that calls function handleClick
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // creates number of cells in top row to equal WIDTH and appends to DOM
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // Creates a table row element and assigns to a "row" variable
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      // Creates a table cell element and assign to a "cell" variable
      let rowCell = document.createElement("td");
      // adds an id, y-x, to the above table cell element
      // you'll use this later, so make sure you use y-x
      rowCell.setAttribute("id", `${y}-${x}`);
      // appends the table cell to the table row
      row.append(rowCell);
    }
    // appends the row to the html board
    htmlBoard.append(row);

  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) return i;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Makes a div and inserts into correct table cell
  const div = document.createElement("div");
  div.classList.add(`piece`, `p${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(div);
}

/** endGame: announce game end */

function endGame(msg) {

  setTimeout(function () {
    return playAgain.render(msg);
  }, 100);

}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // adds line to update in-memory board
  board[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // checks if all cells in board are filled; if so call, call endGame
  // if (board.every(row => row.every(cell => cell !== null))) { // original
  if (board[0].every(topCell => topCell !== null)) { // more efficient
    endGame(`It's a tie!`);
  };

  // switches currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // Checks four cells to see if they're all legal & all color of current
    // player

  /* // our previous solution
    let arr = [];

    for (let i = 0; i < cells.length; i++) {
      let y = cells[i][0];
      let x = cells[i][1];

      if (board[y] === undefined) {
        return false;
      }

      arr.push(board[y][x]);
    };

    return arr.every(cell => cell === currPlayer);
  
  */

  // more optimal
  return cells.every(
    ([y, x]) =>
      board[y] !== undefined && board[y][x] === currPlayer
  );
}

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // assigns values to the below variables for each of the ways to win
      // horizontal has been assigned for you

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

restart.addEventListener('click', function() {
  location.reload();
});

function CustomConfirm(msg) {
  this.render = function (msg) {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const dialogoverlay = document.querySelector('#dialogoverlay');
    const dialogbox = document.querySelector('#dialogbox');
    dialogoverlay.style.display = "block";
    dialogoverlay.style.height = winH + "px";
    dialogbox.style.left = (winW / 4) + "px";
    dialogbox.style.top = (winH / 5) + "px";
    dialogbox.style.display = "block";

    document.querySelector('#dialogboxhead').innerHTML = `<h1>${msg}</h1><h3>Thanks for playing <span class=blue>Connect </span><span class=red>4</span></h3>`;
    document.querySelector('#dialogboxbody').innerHTML = 'Would you like to play again?';
    document.querySelector('#dialogboxfoot').innerHTML = '<button onclick="playAgain.yes()">Yes</button> <button onclick="playAgain.no()">No</button>';
  }
  this.no = function () {
    document.querySelector('#dialogbox').style.display = "none";
    document.querySelector('#dialogoverlay').style.display = "none";
  }
  this.yes = function () {
    location.reload();
    document.querySelector('#dialogbox').style.display = "none";
    document.querySelector('#dialogoverlay').style.display = "none";
  }
}

makeBoard();
makeHtmlBoard();
