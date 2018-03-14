'use strict';

var WALL = '#';
var FOOD = '.';
var EMPTY = ' ';
var SUPER = '|.|';
var NEW_SUPER_CREATION = 1000;
var SUPER_DURATION = 5000;

var gBoard;
var gState = {
  score: 0,
  isGameDone: false
};
var gSuperInterval;

function init() {
  gBoard = buildBoard();
  setSuperInterval();
  printMat(gBoard, '.boardContainer');
  console.table(gBoard);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;

      // Plcae WALLs 
      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j == 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;
      }
    }
  }
  createPacman(board);
  createGhosts(board);
  return board;
}

function setSuperInterval() {
  if (!gSuperInterval) {
      gSuperInterval = setInterval(createSuper, NEW_SUPER_CREATION);
  }
}

function createSuper(){
  var isValid;
  var empties = getAllLocations();

  var rndIdx = getRandomIntInclusive(0, empties.length);
  renderCell(rndIdx, SUPER);

  setTimeout(function () { clearSuper(rndIdx); }, SUPER_DURATION);
}

function getAllLocations(){
  var locations = [];

  for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[i].length; j++) {

          if (gBoard[i][j] === EMPTY || gBoard[i][j] === FOOD) {
              var locationObj = { i: i, j: j };
              locations.push(locationObj);
          }
      }
  }
  return locations;
}

function clearSuper(index){
  gBoard[index.i][index.j] = EMPTY;
}

// This function is called from both pacman and ghost to check engage
function checkEngage(cell, opponent) {
  if (cell === opponent) {
    // TODO: basic support for eating power-ball (which is not in the game yet)
    if (gPacman.isSuper) {
      console.log('Ghost is dead');
    } else {
      clearInterval(gIntervalGhosts);
      gIntervalGhosts = undefined;
      gState.isGameDone = true;
      // TODO: GameOver popup with a play again button
      console.log('Game Over!');
      return true;
    }
  }
  return false;
}


// this function updates both the model and the dom for the score
function updateScore(value) {
  gState.score += value;
  var elScore = document.querySelector('.score')
  elScore.innerText = gState.score;
}

function renderCell(location, value) {
  //debugger;
  var cellSelector = '.cell' + location.i + '-' + location.j;
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

