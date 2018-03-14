
var gNums = [];
var gNumsMat = [];
var gCurrNum = 1;
var gNumOfCells = 16;
var gTime = 0;
var gTimeInterval;


function initTable() {
    var LENGTH = Math.sqrt(gNumOfCells);

    for (var i = 0; i < gNumOfCells; i++) {
        gNums.push(i + 1);
    }

    shuffle(gNums);
    //console.log('nums:', nums);

    for (var i = 0; i < LENGTH; i++) {
        gNumsMat[i] = [];

        for (var j = 0; j < LENGTH; j++) {
            gNumsMat[i].push(gNums.pop());
        }
    }
    //console.log('mat:',gNumsMat);
}

function initButtons() {
    var elRadioBtn = document.querySelector('.easy');
    elRadioBtn.checked = true;

    elRadioBtn = document.querySelector('.hard');
    elRadioBtn.checked = false;

    elRadioBtn = document.querySelector('.extreme');
    elRadioBtn.checked = false;
}

function renderNums() {
    var elTblNums = document.querySelector('.tbl-nums');
    var strHtml = '';
    for (var i = 0; i < gNumsMat.length; i++) {
        var numsRow = gNumsMat[i];
        strHtml += '<tr>';

        for (var j = 0; j < gNumsMat[i].length; j++) {
            var clickedNum = gNumsMat[i][j];
            strHtml += '<td onClick= "cellClicked(this, ' + clickedNum + ')">' + clickedNum + '</td>';
        }
        strHtml += '</tr>';
    }
    //console.log('strHtml', strHtml);
    elTblNums.innerHTML = strHtml;
}


function shuffle(items) {
    var j, tempItem, i;
    for (i = items.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tempItem = items[i];
        items[i] = items[j];
        items[j] = tempItem;
    }
    return items;
}

function cellClicked(elCol, clickedNum) {
    if (gCurrNum === clickedNum) {
        elCol.classList.add('selected');
        gCurrNum++;
        renderNextNum();

        if (clickedNum === 1) {
            getTime();
            renderTime();
            gTimeInterval = setInterval(calcTime, 1000);
        }

        var numOfCells = gNumOfCells;
        if (clickedNum === numOfCells) {
            stopTimer();
        }
    }
}

function renderNextNum() {
    var nextNum = document.querySelector('.next-num');
    nextNum.innerHTML = 'Next Num: ' + gCurrNum;
}

function calcTime() {
    getTime();
    renderTime();
}

function getTime() {
    var time = new Date();
    gTime = time.getSeconds() + time.getMilliseconds() / 1000;
}

function renderTime() {
    var elTimer = document.querySelector('.game-timer');
    elTimer.innerHTML = gTime.toFixed(3) + '';
}

function resetGame() {
    stopTimer();
    resetVars();
    removeSelected();
    initGame();
}

function changeLevel(elInput) {
    changeRadios(elInput);
    var level = elInput.className;
    switchNumOfCells(level);
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

function switchNumOfCells(level) {
    switch (level) {
        case 'easy':
            gNumOfCells = 16;
            break;

        case 'hard':
            gNumOfCells = 25;
            break;

        case 'extreme':
            gNumOfCells = 36;
            break;

        default:
            gNumOfCells = 16;
    }

}

function initGame() {
    initTable();
    renderNums();
}

function resetVars() {
    gCurrNum = 1;
    gNums = [];
    gNumsMat = [];
    gTime = 0;
    resetTimer();
    renderNextNum();
}

function resetTimer() {
    var elTimer = document.querySelector('.game-timer');
    elTimer.innerHTML = '';
}

function stopTimer() {
    clearInterval(gTimeInterval);
    gTimeInterval = undefined;
}

function removeSelected() {
    var elTblNums = document.querySelector('.tbl-nums');

    for (var i = 0; i < elTblNums.length; i++) {
        for (var j = 0; j < elTblNums[i].length; j++) {
            elTblNums[i][j].classList.remove('selected');
        }
    }

}

//Run functions
initGame();
initButtons();
