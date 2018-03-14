'use strict';

var gBoard;
var gGamerPos;
var gStepsCount = 100;
var gGameInterval;
var gBonusInterval;
var gFreeSteps = 0;
var gPullBoxEnabled = false;

//Constants:
//=========
//Logical states:
//0 - Floor(empty cell)
//1-  Wall
//2 - Box
//3 - Target
//4 - Player
//5-  Box on target
//6-  Player on target
//7-  Clock
//8-  Magnet
//9-  Gold
var FLOOR = 0;
var WALL = 1;
var BOX = 2;
var TARGET = 3;
var PLAYER = 4;
var BOX_ON_TARGET = 5;
var PLAYER_ON_TARGET = 6;
var CLOCK = 7;
var MAGNET = 8;
var GOLD = 9;

var NEW_POWER_UP_CREATION = 10000;
var POWER_UP_DURATION = 5000;
var BONUS_GOLD_SCORE = 100;
var TIME_UNIT = 1000;

function initGame() {
    gBoard = createBoard();
    setBonusesInterval();
    //console.log('gBoard:', gBoard);
    gGamerPos = getPlayerPosition(gBoard);
    //console.log('gGamerPos', gGamerPos);
    renderBoard(gBoard);
    renderScore();
}

function setBonusesInterval() {
    if (!gBonusInterval) {
        gBonusInterval = setInterval(createBonus, NEW_POWER_UP_CREATION);
    }
}

function getPlayerPosition(board) {
    var position = {};

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === PLAYER || board[i][j] === PLAYER_ON_TARGET) {
                position.i = i;
                position.j = j;
                break;
            }
        }
    }
    return position;
}

function canPlayerMoveToIdx(toI, toJ, boxToI, boxToJ) {
    var playerCanMove = false;

    if (toJ >= 0 && toJ < gBoard[0].length && toI >= 0 && toI < gBoard.length) {
        if (gBoard[toI][toJ] === FLOOR || gBoard[toI][toJ] === TARGET || isPowerUp(toI, toJ)) {
            playerCanMove = true;
        }
        else if (gBoard[toI][toJ] === BOX || gBoard[toI][toJ] === BOX_ON_TARGET) {
            var canBoxMove = canBoxMoveToIdx(boxToI, boxToJ);
            if (canBoxMove) {
                playerCanMove = true;
            }
        }
    }
    return playerCanMove;
}

function isPowerUp(i, j) {
    return (gBoard[i][j] === CLOCK || gBoard[i][j] === MAGNET || gBoard[i][j] === GOLD);
}

function getPlayerValidMoves() {
    var playerValidMoves = [];
    var i = gGamerPos.i;
    var j = gGamerPos.j;
    var playerCanMove;
    var moveStr;

    var moveStr = getMoveIfValid(i, j - 1, i, j - 2);
    if (moveStr) playerValidMoves.push(moveStr);

    moveStr = '';
    moveStr = getMoveIfValid(i, j + 1, i, j + 2);
    if (moveStr) playerValidMoves.push(moveStr);

    moveStr = '';
    moveStr = getMoveIfValid(i - 1, j, i - 2, j);
    if (moveStr) playerValidMoves.push(moveStr);

    moveStr = '';
    moveStr = getMoveIfValid(i + 1, j, i + 2, j);
    if (moveStr) playerValidMoves.push(moveStr);

    return playerValidMoves;
}

function getMoveIfValid(toI, toJ, boxToI, boxToJ) {
    var playerCanMove = canPlayerMoveToIdx(toI, toJ, boxToI, boxToJ);
    var moveStr;

    if (playerCanMove) {
        moveStr = toI + ',' + toJ;
    }
    return moveStr;
}

function canBoxMoveToIdx(toI, toJ) {
    var boxCanMove = false;

    if (gBoard[toI][toJ] === FLOOR || gBoard[toI][toJ] === TARGET) {
        boxCanMove = true;
    }

    if (gBoard[toI][toJ] === WALL || gBoard[toI][toJ] === BOX || gBoard[toI][toJ] === BOX_ON_TARGET) {
        boxCanMove = false;
    }
    return boxCanMove;
}

function createEmptyBoard(height, width) {
    var board = [];

    for (var i = 0; i < height; i++) {
        board[i] = [];

        for (var j = 0; j < width; j++) {
            var state = FLOOR;
            board[i][j] = state;
        }
    }
    return board;
}

function createBoard() {
    var height = 9;
    var width = 8;

    var board = createEmptyBoard(height, width);
    //row 0:
    board[0][2] = WALL;
    board[0][3] = WALL;
    board[0][4] = WALL;
    board[0][5] = WALL;
    board[0][6] = WALL;

    //row 1:
    board[1][0] = WALL;
    board[1][1] = WALL;
    board[1][2] = WALL;
    board[1][6] = WALL;

    //row 2:
    board[2][0] = WALL;
    board[2][1] = TARGET;
    board[2][2] = PLAYER;
    board[2][3] = BOX;
    board[2][6] = WALL;

    //row 3:
    board[3][0] = WALL;
    board[3][1] = WALL;
    board[3][2] = WALL;
    board[3][4] = BOX;
    board[3][5] = TARGET;
    board[3][6] = WALL;


    //row 4:
    board[4][0] = WALL;
    board[4][1] = TARGET;
    board[4][2] = WALL;
    board[4][3] = WALL;
    board[4][4] = BOX;
    board[4][6] = WALL;

    //row 5:
    board[5][0] = WALL;
    board[5][2] = WALL;
    board[5][4] = TARGET;
    board[5][6] = WALL;
    board[5][7] = WALL;

    //row 6:
    board[6][0] = WALL;
    board[6][1] = BOX;
    board[6][3] = BOX_ON_TARGET;
    board[6][4] = BOX;
    board[6][5] = BOX;
    board[6][6] = TARGET;
    board[6][7] = WALL;

    //row 7:
    board[7][0] = WALL;
    board[7][4] = TARGET;
    board[7][7] = WALL;

    //row 8:
    board[8][0] = WALL;
    board[8][1] = WALL;
    board[8][2] = WALL;
    board[8][3] = WALL;
    board[8][4] = WALL;
    board[8][5] = WALL;
    board[8][6] = WALL;
    board[8][7] = WALL;

    return board;
}

function isValidPosition(i, j) {
    return gBoard[i][j] === FLOOR;
}

function getAllFloors() {
    var floors = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            if (gBoard[i][j] === FLOOR) {
                var floorObj = { i: i, j: j };
                floors.push(floorObj);
            }
        }
    }
    return floors;
}

function createBonus() {
    var isValid;
    var floors = getAllFloors();
    var type = getRandomInt(7, 10);

    var rndFloorIdx = getRandomInt(0, floors.length);
    var floor = floors[rndFloorIdx];
    gBoard[floor.i][floor.j] = type;

    renderBoard(gBoard);
    setTimeout(function () { clearBonus(floor.i, floor.j); }, POWER_UP_DURATION);
}


function clearBonus(bonusRow, bonusColumn) {
    if (gBoard[bonusRow][bonusColumn] !== PLAYER) {
        gBoard[bonusRow][bonusColumn] = FLOOR;
    }
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';

        for (var j = 0; j < row.length; j++) {
            var state = row[j];
            var cellContent = convertState(state);

            var tdId = i + ',' + j;
            strHtml += '<td id="' + tdId +
                '"  onclick="cellClicked(' + i + ', ' + j + ')">' +
                cellContent + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}

function cellClicked(iIdx, jIdx) {
    var playerValidMoves = getPlayerValidMoves();
    //console.log('valid moves:', playerValidMoves);
    var nextCell = gBoard[iIdx][jIdx];

    //if next cell is the same as current cell
    //don't move the player
    if (nextCell === gBoard[gGamerPos.i][gGamerPos.j]) return;

    for (var k = 0; k < playerValidMoves.length; k++) {
        var currMove = playerValidMoves[k];
        var coord = getCellCoord(currMove);

        if (coord.i === iIdx && coord.j === jIdx) {
            if (gPullBoxEnabled) {
                movePlayer(gGamerPos.i, gGamerPos.j, iIdx, jIdx);
                moveBoxIfNeeded(iIdx, jIdx);
            }
            else {
                moveBoxIfNeeded(iIdx, jIdx);
                movePlayer(gGamerPos.i, gGamerPos.j, iIdx, jIdx);
            }

            if (!gGameInterval) {
                gGameInterval = setInterval(renderScore, TIME_UNIT);
            }
        }
    }
    //console.log('gBoard after move:', gBoard);
    renderBoard(gBoard);
    var isGameOver = checkGameOver();

    if (isGameOver) {
        alert('Victory!!!')
        stopScoreCalc();
        clearBonusInterval();
    }
}

function isBoxInPosition(i, j) {
    return (gBoard[i][j] === BOX || gBoard[i][j] === BOX_ON_TARGET);
}

function moveBoxIfNeeded(fromI, fromJ) {
    if (gPullBoxEnabled) {
        pullBoxToPositionIfNeeded(fromI, fromJ);
    }
    else {
        pushBoxToPositionIfNeeded(fromI, fromJ);
    }
}

function pushBoxToPositionIfNeeded(fromI, fromJ) {
    var nextCell = gBoard[fromI][fromJ];

    if (nextCell === BOX || nextCell === BOX_ON_TARGET) {
        //move box first
        var destination;
        if (gGamerPos.i === fromI) {
            //the player wants to move right
            if (gGamerPos.j < fromJ) {
                destination = fromJ + 1;
                moveBox(fromI, fromJ, fromI, destination);
            }
            //the player wants to move left
            else if (gGamerPos.j > fromJ) {
                destination = fromJ - 1;
                moveBox(fromI, fromJ, fromI, destination);
            }
        }
        else if (gGamerPos.j === fromJ) {
            //the player wants to move down
            if (gGamerPos.i < fromI) {
                destination = fromI + 1;
                moveBox(fromI, fromJ, destination, fromJ);
            }
            //the player wants to move up
            else if (gGamerPos.i > fromI) {
                destination = fromI - 1;
                moveBox(fromI, fromJ, destination, fromJ);
            }
        }
    }
}

function pullBoxToPositionIfNeeded(playerToI, playerToJ) {
    var newBoxCell;

    if (isInBounds(playerToI, playerToJ - 2) && isBoxInPosition(playerToI, playerToJ - 2)) {
        newBoxCell = gBoard[playerToI][playerToJ - 2];
        moveBox(playerToI, playerToJ - 2, playerToI, playerToJ - 1);
        gPullBoxEnabled = false;
        return;
    }

    if (isInBounds(playerToI - 2, playerToJ) && isBoxInPosition(playerToI - 2, playerToJ)) {
        newBoxCell = gBoard[playerToI - 2][playerToJ];
        moveBox(playerToI - 2, playerToJ, playerToI - 1, playerToJ);
        gPullBoxEnabled = false;
        debugger;
        return;
    }

    if (isInBounds(playerToI, playerToJ + 2) && isBoxInPosition(playerToI, playerToJ + 2)) {
        newBoxCell = gBoard[playerToI][playerToJ + 2];
        moveBox(playerToI, playerToJ + 2, playerToI, playerToJ + 1);
        gPullBoxEnabled = false;
        debugger;
        return;
    }

    if (isInBounds(playerToI + 2, playerToJ) && isBoxInPosition(playerToI + 2, playerToJ)) {
        newBoxCell = gBoard[playerToI + 2][playerToJ];
        moveBox(playerToI + 2, playerToJ, playerToI + 1, playerToJ);
        gPullBoxEnabled = false;
        debugger;
        return;
    }
}

function isInBounds(i, j) {
    return (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length);
}

function moveBox(fromI, fromJ, toI, toJ) {
    //check if box was on target
    gBoard[fromI][fromJ] = (gBoard[fromI][fromJ] === BOX_ON_TARGET) ? TARGET : FLOOR;
    //check if box will move to target
    gBoard[toI][toJ] = (gBoard[toI][toJ] === TARGET) ? BOX_ON_TARGET : BOX;
}

function movePlayer(fromI, fromJ, toI, toJ) {
    var nextCell = gBoard[toI][toJ];
    var gGamerPosVal = gBoard[gGamerPos.i][gGamerPos.j];
    gBoard[fromI][fromJ] = (gGamerPosVal === PLAYER_ON_TARGET) ? TARGET : FLOOR;

    if (nextCell === BOX_ON_TARGET || nextCell === TARGET) {
        gBoard[toI][toJ] = PLAYER_ON_TARGET;
    } else {
        if (isPowerUp(toI, toJ)) {
            performPowerUp(toI, toJ);
        }
        gBoard[toI][toJ] = (nextCell === TARGET) ? PLAYER_ON_TARGET : PLAYER;
    }

    if (gFreeSteps === 0) {
        gStepsCount--;
    } else {
        gFreeSteps--;
    }

    gGamerPos.i = toI;
    gGamerPos.j = toJ;
}

function performPowerUp(i, j) {
    var powerUp = gBoard[i][j];

    switch (powerUp) {
        case GOLD:
            gStepsCount += BONUS_GOLD_SCORE;
            renderScore();
            break;

        case CLOCK:
            gFreeSteps = 10;
            break;

        case MAGNET:
            gPullBoxEnabled = true;
            break;
    }
}

function checkGameOver() {
    var isGameOver = true;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === BOX) {
                isGameOver = false;
                break;
            }
        }
    }
    return isGameOver;
}

function renderScore() {
    var elScore = document.querySelector('.game-score');
    elScore.innerHTML = 'Score:\n' + gStepsCount;
}


function stopScoreCalc() {
    clearInterval(gGameInterval);
    gGameInterval = undefined;
}

function clearBonusInterval() {
    clearInterval(gBonusInterval);
    gBonusInterval = undefined;
}

function resetGame() {
    resetVars();
    initGame();
}

function resetVars() {
    gBoard = [];
    gGamerPos = {};
    gGameInterval = undefined;
    gBonusInterval = undefined;
    gStepsCount = 100;
    gFreeSteps = 0;
    gPullBoxEnabled = false;
}

// Gets a string such as: '2,7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(0, strCellId.lastIndexOf(','));
    coord.j = +strCellId.substring(strCellId.lastIndexOf(',') + 1);
    // console.log('coord', coord);
    return coord;
}

function convertState(state) {
    var symbol;

    switch (state) {
        case FLOOR:
            symbol = '';
            break;

        case WALL:
            symbol = '❎';
            break;

        case BOX:
            symbol = '💰';
            break;

        case BOX_ON_TARGET:
            symbol = '🤑';
            break;

        case TARGET:
            symbol = '🔼';
            break;

        case PLAYER:
        case PLAYER_ON_TARGET:
            symbol = '🤠';
            break;

        case CLOCK:
            symbol = '⌚';
            break;

        case MAGNET:
            symbol = '🔩';
            break;

        case GOLD:
            symbol = '🏆';
            break;

        default:
            symbol = '';
    }
    return symbol;
}