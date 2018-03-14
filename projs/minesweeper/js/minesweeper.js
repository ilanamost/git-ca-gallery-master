'use strict';

var gLevel = createLevel(4, 2);
var gState = createState();
var gBoard = [];
var gCurrBoard = [];
var gRadius;
var gSelectedMine = false;
var gMineIdxs;
var gClicksCount = 0;
var gTimeInterval;
var gLastIcoord;
var gLastJcoord;

//Constants:
//=========
//Logical states:
//-1 - Empty cell
//0... 8 - 0... 8
//9 - Flag
//10 - Mine
var EMPTY = -1;
var ZERO_STATE = 0;
var ONE_STATE = 1;
var TWO_STATE = 2;
var THREE_STATE = 3;
var FOUR_STATE = 4;
var FIVE_STATE = 5;
var SIX_STATE = 6;
var SEVEN_STATE = 7;
var EIGHT_STATE = 8;
var FLAG = 9;
var MINE = 10;

var TIME_UNIT = 1000;


function createLevel(size, mines) {
    var level = {
        SIZE: size,
        MINES: mines
    }
    return level;
}

function createState() {
    var state = {
        isGameOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    return state;
}

function initGame() {
    initButtons();
    gRadius = gLevel.SIZE - 1;
    gBoard = buildBoard();
    //console.log('gBoard:', gBoard);
    displayEmptyBoard();
}

function displayEmptyBoard() {
    gCurrBoard = createEmptyBoard();
    renderBoard(gCurrBoard);
}

function createEmptyBoard() {
    var board = [];
    var LENGTH = gLevel.SIZE;

    for (var i = 0; i < LENGTH; i++) {
        board[i] = [];

        for (var j = 0; j < LENGTH; j++) {
            var state = EMPTY;
            board[i][j] = state;
        }
    }
    return board;
}

function buildBoard() {
    gMineIdxs = createMineIdxs();
    //console.log('mineIdxs', gMineIdxs);
    var board = createEmptyBoard();

    for (var k = 0; k < gMineIdxs.length; k++) {
        var currIdx = gMineIdxs[k];
        board[currIdx.i][currIdx.j] = MINE;
    }
    setMinesNegsCount(board);
    return board;
}

function setMinesNegsCount(board) {
    var minesNegsCount = 0;

    for (var i = 0; i < board.length; i++) {
        var row = board[i];

        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] !== MINE) {
                var countNegMines = chkNegs(board, i, j);
                board[i][j] = countNegMines;
            }
        }
    }
}

function chkNegs(board, rowIdx, colIdx) {
    var negMinesCount = 0;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        //If out of mat - continue
        if (!(i >= 0 && i < board.length)) continue;

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            // If middle cell or out of mat - continue;
            if ((i === rowIdx && j === colIdx) ||
                (j < 0 || j >= board[i].length)) continue;

            if (board[i][j] === MINE) {
                negMinesCount++;
            }
        }
    }
    return negMinesCount;
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
                '"  onclick="cellClicked(this, ' + i + ', ' + j + ')" oncontextmenu="cellMarked(this); return false" >' +
                cellContent + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}

function setMarkedAndShownCellsCount() {
    gState.markedCount = 0;
    gState.shownCount = 0;

    for (var i = 0; i < gCurrBoard.length; i++) {
        for (var j = 0; j < gCurrBoard[i].length; j++) {
            if (gCurrBoard[i][j] === FLAG) {
                gState.markedCount++;
            } else {
                if (gCurrBoard[i][j] !== EMPTY) {
                    gState.shownCount++;
                }
            }
        }
    }
}

function cellMarked(elCell) {
    var strCellId = elCell.id;
    var coord = getCellCoord(strCellId);
    var isGameOver = checkGameOver();

    if (gState.markedCount < gLevel.MINES &&
        gCurrBoard[coord.i][coord.j] !== FLAG &&
        !isGameOver) {

        gCurrBoard[coord.i][coord.j] = FLAG;
        renderBoard(gCurrBoard);
        setMarkedAndShownCellsCount();
        var isGameOver = checkGameOver();
        if (isGameOver) {
            stopTimer();
            isVictory() ? alert('YOU WON!!!') : alert('YOU LOSE :(')
        }

    } else {
        if (gCurrBoard[coord.i][coord.j] = FLAG) {
            gCurrBoard[coord.i][coord.j] = EMPTY;
            renderBoard(gCurrBoard);
            setMarkedAndShownCellsCount();
            //console.log('Shown count', gState.shownCount);
            //console.log('Marked count', gState.markedCount);
        }
    }
}

function checkGameOver() {
    var isGameOver;
    gState.isGameOn = (isVictory() || gSelectedMine) ? false : true;
    isGameOver = (gState.isGameOn) ? false : true;

    // console.log('are all mines marked?', allMinesMarked);
    // console.log('are all cells with value shown?', allValCellsShown);
    //console.log('isGameOn?', gState.isGameOn);
    //console.log('ShownCount:', gState.shownCount);
    //console.log('MarkedCount:', gState.markedCount);

    return isGameOver;
}

function isVictory() {
    var allMinesMarked = areAllMinesMarked();
    var allValCellsShown = areAllValCellsShown();

    return allMinesMarked && allValCellsShown;
}

function areAllValCellsShown() {
    var allValCellsShown = true;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];

            //check if cell has value
            if (currCell !== EMPTY && currCell !== MINE) {
                //check if current board state is the
                //same as the original board state
                if (gCurrBoard[i][j] !== currCell) {
                    allValCellsShown = false;
                }
            }
        }
    }
    return allValCellsShown;
}

function areAllMinesMarked() {
    var allMinesMarked = true;
    var anyMarkedCells = areAnyCellsMarked();

    if (anyMarkedCells) {
        for (var k = 0; k < gMineIdxs.length; k++) {
            var currIdx = gMineIdxs[k];

            if (gCurrBoard[currIdx.i][currIdx.j] !== FLAG) {
                allMinesMarked = false;
            }
        }
    } else {
        //no cells are marked
        allMinesMarked = false;
    }
    return allMinesMarked;
}

function areAnyCellsMarked() {
    return gState.markedCount > 0;
}

function convertState(state) {
    var symbol;

    if (state === MINE) {
        symbol = '💣';
    }
    else if (state === FLAG) {
        symbol = '⚑';
    }
    else if (state === EMPTY) {
        symbol = '';
    }
    else {
        symbol = state + '';
    }
    return symbol;
}

function cellClicked(elCell, i, j) {
    //console.log('elCell', elCell);
    if (gClicksCount < 2) {
        gClicksCount++;
    }

    if (gClicksCount === 1) {
        gTimeInterval = setInterval(calcTime, TIME_UNIT);
    }

    if (!gSelectedMine) {
        if (gBoard[i][j] === MINE) {
            addAllMines();
            gSelectedMine = true;
        } else {
            expandShownInRadiuses(i, j);
        }
        renderBoard(gCurrBoard);
        setMarkedAndShownCellsCount();
    }
    var isGameOver = checkGameOver();
    if (isGameOver) {
        stopTimer();
        isVictory() ? alert('YOU WON!!!') : alert('YOU LOSE :(')
    }
}

function calcTime() {
    getTime();
    renderTime();
}

function getTime() {
    var time = new Date();
    gState.secsPassed = time.getSeconds();
}

function stopTimer() {
    clearInterval(gTimeInterval);
    gTimeInterval = undefined;
}


function renderTime() {
    var elTimer = document.querySelector('.game-timer');
    if (gState.secsPassed > 0) {
        elTimer.innerHTML = 'Time:' + gState.secsPassed;
    } else {
        elTimer.innerHTML = 'Time:';
    }
}

function addAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];

            if (currCell === MINE) {
                gCurrBoard[i][j] = gBoard[i][j];
            }
        }
    }
}

function expandShownInRadius(i, j, radius) {
    for (var rowIdx = i - radius; rowIdx <= i + radius; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= gBoard.length) continue;

        for (var colIdx = j - radius; colIdx <= j + radius; colIdx++) {
            if (colIdx < 0 || colIdx >= gBoard.length) continue;
            gCurrBoard[rowIdx][colIdx] = gBoard[rowIdx][colIdx];
        }
    }
}

function expandShownInRadiuses(i, j) {
    var isMines = false;

    for (var k = 1; k <= gRadius; k++) {
        isMines = isMinesInRadius(k, i, j);
        if (!isMines) {
            expandShownInRadius(i, j, k);
        }
    }
    //if there are mines in all levels
    //show only the cell clicked on
    if (isMines) {
        gCurrBoard[i][j] = gBoard[i][j];
    }
}

function isMinesInRadius(radius, i, j) {
    for (var rowIdx = i - radius; rowIdx <= i + radius; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= gBoard.length) continue;

        for (var colIdx = j - radius; colIdx <= j + radius; colIdx++) {
            if (i === rowIdx && j === colIdx) continue;
            if (colIdx < 0 || colIdx >= gBoard.length) continue;
            if (gBoard[rowIdx][colIdx] === MINE) return true;
        }
    }
    return false;
}

function createMineIdxs() {
    var mineIdxs = [];
    var iCoord;
    var jCoord;

    for (var i = 0; i < gLevel['MINES']; i++) {
        mineIdxs[i] = [];
        iCoord = getRandomInt(0, gLevel['SIZE']);
        jCoord = getRandomInt(0, gLevel['SIZE']);

        if (gLastIcoord && gLastJcoord) {
            while (gLastIcoord === iCoord && gLastJcoord === jCoord) {
                iCoord = getRandomInt(0, gLevel['SIZE']);
                jCoord = getRandomInt(0, gLevel['SIZE']);
            }
        }
        gLastIcoord = iCoord;
        gLastJcoord = jCoord;

        var strCellId = iCoord + ',' + jCoord;
        mineIdxs[i] = getCellCoord(strCellId);
    }
    return mineIdxs;
}

// Gets a string such as: '2,7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(0, strCellId.lastIndexOf(','));
    coord.j = +strCellId.substring(strCellId.lastIndexOf(',') + 1);
    // console.log('coord', coord);
    return coord;
}

function changeLevel(elInput) {
    changeRadios(elInput);
    var level = elInput.className;
    switchLevel(level);
    resetGame();
}

function changeRadios(elInput) {
    var elRadioBtn = document.querySelector('.easy');
    if (elInput !== elRadioBtn) elRadioBtn.checked = false;

    elRadioBtn = document.querySelector('.hard');
    if (elInput !== elRadioBtn) elRadioBtn.checked = false;

    elRadioBtn = document.querySelector('.extreme');
    if (elInput !== elRadioBtn) elRadioBtn.checked = false;

}

function switchLevel(level) {
    switch (level) {
        case 'easy':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;

        case 'hard':
            gLevel.SIZE = 6;
            gLevel.MINES = 5;
            break;

        case 'extreme':
            gLevel.SIZE = 8;
            gLevel.MINES = 15;
            break;

        default:
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
    }
}

function initButtons() {
    var radios = document.querySelectorAll('input');
    var anyRadiosChecked = false;

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked === true) {
            anyRadiosChecked = true;
            break;
        }
    }

    if (!anyRadiosChecked) {
        var elRadioBtn = document.querySelector('.easy');
        elRadioBtn.checked = true;
    }
}

function resetGame() {
    stopTimer();
    resetVars();
    renderTime();
    initGame();
}

function resetVars() {
    gState = createState();
    gBoard = [];
    gCurrBoard = [];
    gRadius;
    gSelectedMine = false;
    gMineIdxs;
    gClicksCount = 0;
    gLastIcoord;
    gLastJcoord;
}