var gQuests = [];
var gCurrQuestIdx = 0;
var gScore = 100;

//Constants//
var RED_BORDER_DURATION = 1000;
var NUM_OF_ANS = 2;
var NUM_OF_QUESTS = 3;
var MAX_SCORE = 100;
var SCORE_FOR_QUEST = 5;

function createQuests() {
    var quests = [];
    var quest1 = { id: 1, opt: ["That pup can run!", "That bug can run!"], correctOptIdx: 0 };
    quests.push(quest1);

    var quest2 = { id: 2, opt: ["The baby is crying", "The panda is waving"], correctOptIdx: 1 };
    quests.push(quest2);

    var quest3 = { id: 3, opt: ["The biever is drinking beer", "The biever is building a dam"], correctOptIdx: 0 };
    quests.push(quest3);
    return quests;
}

function initGame() {
    gQuests = createQuests();
    hide();
    renderQuest(NUM_OF_ANS);
}

function renderQuest(numOfAns) {
    var strHtml = '';

    var elImg = document.querySelector('img');
    var imgIdx = gCurrQuestIdx + 1;
    strHtml = imgIdx + ".jpg";
    elImg.src = "img/" + strHtml;

    strHtml = '';

    for (var j = 0; j < numOfAns; j++) {
        var currQuest = gQuests[gCurrQuestIdx];
        var cellContent = currQuest.opt[j];

        var id = j;
        strHtml += '<button id="' + id +
            '"  onclick="checkAnswer(' + id + ')">' +
            cellContent + '</button>';
    }

    var elButtonsContainer = document.querySelector('.buttons-container');
    elButtonsContainer.innerHTML = strHtml;
}

function checkAnswer(optIdx) {
    var currQuest = gQuests[gCurrQuestIdx];
    var id = +optIdx;

    //if user is right
    if (id === currQuest.correctOptIdx) {
        if (gQuests[gCurrQuestIdx + 1]) {
            gCurrQuestIdx++;
            renderQuest(NUM_OF_ANS);
        } else {
            //handle victory
            display();
        }
       
    } else {
        var score = SCORE_FOR_QUEST/ MAX_SCORE;
        gScore-= score;
        gScore = gScore.toFixed(2);
        var elCurrButton = document.getElementById(optIdx);
        elCurrButton.classList.add('button-color');

        setTimeout(function () {
            elCurrButton.classList.remove('button-color');
        },
            RED_BORDER_DURATION);
    }
}

function hide() {
    var elScore = document.querySelector('.score');
    elScore.innerHTML = 'Score: ' + gScore;
    elScore.classList.add('hidden');

    elRestart = document.querySelector('.restart');
    elRestart.classList.add('hidden');
}

function display() {
    var elScore = document.querySelector('.score');
    elScore.innerHTML = 'Score: ' + gScore;
    elScore.classList.remove('hidden');

    elRestart = document.querySelector('.restart');
    elRestart.classList.remove('hidden');
}

function restart() {
    resetVars();
    initGame();
}

function resetVars() {
    gQuests = [];
    gCurrQuestIdx = 0;
    gScore = 100;
}
