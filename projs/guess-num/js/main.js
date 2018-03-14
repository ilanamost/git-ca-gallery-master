

var gNum = getRandomInt(1, 5);

function onButtonClick() {
    var userNum = +prompt('Please enter a number between 1 and 5:');
    //console.log('num:', gNum);
    var elUserMsg = document.querySelector('.user-msg');

    if (userNum < gNum) {
        elUserMsg.innerHTML = 'You guessed: ' + userNum + '- Too Low!';
    }

    else if (userNum > gNum) {
        elUserMsg.innerHTML = 'You guessed: ' + userNum + '- Too High!';
    } else{
        elUserMsg.innerHTML = 'Your guess is correct!';
    }
}




function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}