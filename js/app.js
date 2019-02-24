/* jshint esversion: 6 */

var iconOptions = [
    'fa fa-anchor',
    'fa fa-bicycle',
    'fa fa-bolt',
    'fa fa-bomb',
    'fa fa-leaf',
    'far fa-gem',
    'far fa-paper-plane',
    'fas fa-cube',
    'fab fa-angellist',
    'fab fa-apple',
    'fas fa-ankh',
    'fas fa-cat',
    'fas fa-chess-knight',
    'fas fa-cloud-sun',
    'fas fa-cog',
    'fab fa-d-and-d',
    'fas fa-feather',
    'fab fa-github',
    'fas fa-mountain',
    'fas fa-piggy-bank',
    'fas fa-pepper-hot',
    'fas fa-rocket',
    'fas fa-shoe-prints',
    'fas fa-snowplow',
    'fas fa-tractor',
    'fas fa-yin-yang'
];


/*
 * Create a list that holds all of your cards
 */
function getCardList() {
    var cardList = shuffle(iconOptions).slice(0, 8);
    cardList = cardList.concat(cardList);
    return shuffle(cardList);
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function generateCardListView() {
    var ul = document.createElement('ul');
    ul.classList.add('deck');
    getCardList().forEach(function (cardIcon) {
        var li = document.createElement('li');
        li.classList.add('card');
        i = document.createElement('i');
        cardIcon.split(' ').forEach(function (c) { i.classList.add(c); });
        li.append(i);
        ul.append(li);
    });
    document.querySelector('ul.deck').innerHTML = ul.innerHTML;

    document.querySelectorAll('.card').forEach(function (card) {
        card.addEventListener('click', handleCardClick);
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var _moves = document.querySelector('.moves');

document.querySelector('.restart')
    .addEventListener('click', function (e) {
        init();
    });

var _cardSelection = [];
var _started = false;
var _stars = 3;

function handleCardClick(event) {

    if (_cardSelection.length < 2) {

        if (!isValidSelection(this)) {
            return;
        }

        _cardSelection.push(this);

        if (!_started) {
            _started = true;
            startTimer();
        }

        this.classList.add('show', 'open');

        if (_cardSelection.length == 2) {

            _moves.innerText = Number(_moves.innerText) + 1;

            setStars(movesToStars(_moves.innerText));

            if (cardsMatch(_cardSelection)) {

                _cardSelection.forEach(c => c.classList.add('match'));
                _cardSelection = [];

                if (isComplete()) {
                    stopTimer();
                    setTimeout(function () { alert('Whoot! You did it!'); }, 500);
                }

            } else {

                setTimeout(function () {

                    _cardSelection.forEach(c => c.classList.remove('show', 'open'));
                    _cardSelection = [];

                }, 1000);
            }
        }
    }
}
function isValidSelection(cardElement) {
    return !cardElement.classList.contains('open');
}
function cardsMatch(cards) {
    var a = _cardSelection[0].querySelector('i').classList.value,
        b = _cardSelection[1].querySelector('i').classList.value;
    return a === b;
}

/**
 * Set fill on stars
 * 
 * @param {number} v - number of stars to fill; [0  n] increments of 0.5
 */
function setStars(v) {
    var stars = document.querySelectorAll('ul.stars li i'),
        comp = v - 1; // shift v from one-based to zero-based "comp"
    stars.forEach(function (e, i) {
        if (comp < i) {
            if (i - comp === 0.5) { // i + 0.5 stars: set this star to half
                e.classList.remove('fas', 'fa-star');     // full
                e.classList.remove('far', 'fa-star');   // open
                e.classList.add('fas', 'fa-star-half-alt'); // half
            } else { // fewer than i + 0.5 stars: leave this star open
                e.classList.remove('fas', 'fa-star');        // full
                e.classList.remove('fas', 'fa-star-half-alt'); // half
                e.classList.add('far', 'fa-star');    // open
            }
        } else { // at least i + 1 stars: fill this star
            e.classList.remove('far', 'fa-star');               // open
            e.classList.remove('fas', 'fa-star-half-alt'); // half
            e.classList.add('fas', 'fa-star'); // full
        }
    });
}

/**
 *  Check if all cards are matched
 */
function isComplete() {
    return document.querySelectorAll('.card').length === document.querySelectorAll('.card.match').length;
}

/**
 * 
 * @param {number} m - number of moves
 * 
 * decrease from 3 by half for every 4 stars over 8 
 */
function movesToStars(m) {
    var calc = Math.round((3 - m / 8 + 1) * 2) / 2;
    if (calc > 3) return 3;
    if (calc < 0) return 0;
    return calc;
}

/*
 *  Timer
 */
var _startTime = null;
var _timerHandle = null;
function stopTimer() {
    clearInterval(_timerHandle);
}
function startTimer() {
    _startTime = new Date().getTime();
    _timerHandle = setInterval(function () {
        showTime(new Date().getTime() - _startTime);
    }, 1000);
}
function resetTimer() {
    showTime(0);
}
function showTime(t) {
    document.querySelector('.timer').innerText = getTimeString(t);
}
function getTimeString(t) {
    var m = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    s = Math.floor((t % (1000 * 60)) / 1000);
    return zeroPad(m) + ':' + zeroPad(s);
}
function zeroPad(n) {
    return (n < 10 ? '0' : '') + n;
}

function init() {

    _moves.innerText = 0;

    setStars(3);

    generateCardListView();

    stopTimer();
    resetTimer();

    _started = false;
}

init();