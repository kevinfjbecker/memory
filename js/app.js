/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
var cardElements = document.querySelectorAll('.card'),
    moves = document.querySelector('.moves');

document.querySelector('.restart')
    .addEventListener('click', function(e) {
        init();
    });

cardElements.forEach(function(card) {
    card.addEventListener('click', handleCardClick);
});

var cardSelection = [];

function handleCardClick(event) {

    if (cardSelection.length < 2) {

        cardSelection.push(this);

        this.classList.add('show', 'open');

        if (cardSelection.length == 2) {

            moves.innerText = Number(moves.innerText) + 1;

            if (cardsMatch(cardSelection)) {

                cardSelection.forEach(c => c.classList.add('match'));
                cardSelection = [];

            } else {

                setTimeout(function() {

                    cardSelection.forEach(c => c.classList.remove('show', 'open'));
                    cardSelection = [];

                }, 1000);
            }
        }
    }
}

function cardsMatch(cards) {
    var a = cardSelection[0].querySelector('i').classList.value,
        b = cardSelection[1].querySelector('i').classList.value
    return a === b;
}

function init() {

    moves.innerText = 0;

    cardElements.forEach(c => c.classList.remove('match', 'open', 'show'));
}

init();