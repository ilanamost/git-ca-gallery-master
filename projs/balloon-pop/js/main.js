var gNextId = 1;
var gBallonsInterval;
var gBalloons = createBalloons(15);

function moveUp() {
    var balloons = document.querySelectorAll('.balloon');
    //console.log('balloons:', balloons);

    for (var i = 0; i < gBalloons.length; i++) {
        // if(!balloons[i].style.bottom){
        //     balloons[i].style.bottom = 0;
        // }

        //var bottom = parseInt(balloons[i].style.bottom);

        var balloon = gBalloons[i];

        var newDistance = Math.min(600, balloon.bottom + balloon.speed);
        if (newDistance === 600) {
            stopMovingUp();
        }

        gBalloons[i].bottom = newDistance;
        balloons[i].style.bottom = newDistance + 'px';
    }
}

function startMovingUp() {
    gBallonsInterval = setInterval(moveUp, 1000);
}

function stopMovingUp() {
    clearInterval(gBallonsInterval);
}

function createBalloons(numOfBalloons) {
    var balloons = []

    for (var i = 0; i < numOfBalloons; i++) {
        balloons.push(createBalloon());
    }
    return balloons;
}

function createBalloon() {
    return {
        id: gNextId++,
        bottom: 0,
        color: getRandomColor(),
        speed: getRandomInt(10, 40)
    };
}

function renderBalloons(balloons) {
    var elContainer = document.querySelector('.balloons-container');
    var strHtml = '';
    for (var i = 0; i < balloons.length; i++) {
        var balloon = balloons[i];
        strHtml += '<div style="background-color:' + balloon.color + 
            ';left:' + (100 * i) + 'px;" onclick="balloonClicked(this)" class="balloon balloon' +
            (i + 1) + '">' +
            '</div>'
    }
    console.log(strHtml);
    
    elContainer.innerHTML = strHtml;
}

function balloonClicked(balloon) {
    var POP_SOUND_DURATION = 6000;
    var audio = new Audio('sounds/pop.mp3');
    audio.play();

    setTimeout(function () {
    //balloon.style.display = 'none';
      balloon.style.opacity = 0;
    }, POP_SOUND_DURATION);

}

//run functions
renderBalloons(gBalloons);