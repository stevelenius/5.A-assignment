// 5.A-assignment-memory-game.js
//
// Memory game phase II
// 

// set up some starting variables
const DOWN = 'down';
const UP = 'up';
let startingX = 20;
let startingY = 20;
let cards = [];
const gameState = {
    totalPairs: 9,
    flippedCards: [],
    numMatched: 0,
    attempts: 0,
    waiting: false
}

// preload images and fonts
let cardfaceArray = [];
let cardback;
function preload() {
    myFont = loadFont('assets/AkzidenzGrotesk-Extended.otf');
    myFontBold = loadFont('assets/AkzidenzGrotesk-BoldExtended.otf');
    cardback = loadImage('images/0-back.png');
    cardfaceArray = [
        loadImage('images/1-comp.png'),
        loadImage('images/2-trek.png'),
        loadImage('images/3-wave.png'),
        loadImage('images/4-dress.png'),
        loadImage('images/5-drink.png'),
        loadImage('images/6-gown.png'),
        loadImage('images/7-orbit.png'),
        loadImage('images/8-dogs.png'),
        loadImage('images/9-linc.png')
    ]
}

function setup() {
	createCanvas(800, 600);
    textFont(myFont);
    stroke(color(50, 150, 50));
    let selectedFaces = [];
    // load pairs of cardface images into an array
    for (let pairs = 0; pairs < 9; pairs++) {
        const randomIdx = floor(random(cardfaceArray.length));
        const face = cardfaceArray[randomIdx];
        selectedFaces.push(face);
        selectedFaces.push(face);
        // remove the used cardface so it doesn't get randomly selected again
        cardfaceArray.splice(randomIdx, 1);
    }
    // layout cards in 6x3 grid on canvas
    selectedFaces = shuffleArray(selectedFaces);
    for (let rows = 0; rows < 3; rows++) {
        for (let columns = 0; columns < 6; columns++) {
            const faceImage = selectedFaces.pop();
            cards.push(new Card(startingX, startingY, faceImage));
            startingX += 130;
        }
        startingY += 180;
        startingX = 20;
    }
}

function draw () {
    background(color(50, 150, 50));
    fill(color(0));
    stroke('yellow');
    // area at bottom of canvas for scoring feedback
    rect(20, 560, 760, 20);
    stroke(color(50, 150, 50));
    // check if game has been completed; stop if it is
    if (gameState.numMatched === gameState.totalPairs) {
        fill('yellow');
        textFont(myFontBold);
        textSize(14);
        text('YOU DID IT!', 540, 575);
        textFont(myFont);
        noLoop();
    }
    // if card faces showing don't match, turn them back down
    for (let cardToShow = 0; cardToShow < cards.length; cardToShow++) {
        if (!cards[cardToShow].isMatch) {
            cards[cardToShow].face = DOWN;
        }
        cards[cardToShow].show();
    }
    noLoop();
    // reset variables to indicate all cards are face down
    gameState.flippedCards.length = 0;
    gameState.waiting = false;
    // update ATTEMPTS and MATCHES counters at bottom of screen
    fill('yellow');
    textSize(14);
    text('ATTEMPTS: ' + gameState.attempts, 30, 575);
    text('MATCHES: ' + gameState.numMatched, 175, 575);
}

function mousePressed () {
    if (gameState.waiting) {
        return;
    }
    for (let cardToShow = 0; cardToShow < cards.length; cardToShow++) {
        // first check flipped cards length, and then
        // we can trigger the flip
        if (gameState.flippedCards.length < 2 && cards[cardToShow].didHit(mouseX, mouseY)) {
            console.log('flipped', cards[cardToShow]);
            gameState.flippedCards.push(cards[cardToShow]);
        }
    }
    if (gameState.flippedCards.length === 2) {
        gameState.attempts++;
        if (gameState.flippedCards[0].cardFaceImg === gameState.flippedCards[1].cardFaceImg) {
            // cards match! Time to score!
            // mark cards as matched so they don't flip back
            gameState.flippedCards[0].isMatch = true;
            gameState.flippedCards[1].isMatch = true;
            // empty the flipped cards array
            gameState.flippedCards.length = 0;
            // increment the score
            gameState.numMatched++;
            loop();
        } else {
            // if cards don't match, wait two seconds then flip them both down
            // during those two waiting seconds clicks won't register
            gameState.waiting = true;
            const loopTimeout = window.setTimeout(() => {
                loop();
                window.clearTimeout(loopTimeout);
            }, 2000);
        }
    }
}

// build card class
class Card {
    constructor (x, y, cardFaceImg) {
        this.x = x;
        this.y = y;
        this.width = 110;
		this.height = 160;
		this.radius = 10;
        this.face = DOWN;
        this.cardFaceImg = cardFaceImg;
        this.isMatch = false;
        this.show();
    }

    show () {
        // if card has been clicked or has been already matched,
        // show face image
        if (this.face === UP || this.isMatch) {
            rect(this.x, this.y, this.width, this.height, this.radius);
            image(this.cardFaceImg, this.x, this.y);
        } else {
            // otherwise show card back
            rect(this.x, this.y, this.width, this.height, this.radius);
            image(cardback, this.x, this.y);
        }
    }

    // determine whether or not the mouse clicked on a card
    didHit (mouseX, mouseY) {
        if (mouseX >= this.x && mouseX <= this.x + this.width &&
            mouseY >= this.y && mouseY <= this.y + this.height) {
            this.flip();
            return true;
        } else {
            return false;
        }
    }

    // flip a card
    flip () {
        if (this.face === DOWN) {
            this.face = UP;
        } else {
            this.face = DOWN;
        }
        this.show();
    }
}

// shuffle the card images randomly
function shuffleArray (array) {
    let counter = array.length;
    while (counter > 0) {
        // Pick random index
        const idx = Math.floor(Math.random() * counter);
        // decrease counter by 1 (decrement)
        counter--;
        // swap the last element with it
        const temp = array[counter];
        array[counter] = array[idx];
        array[idx] = temp;
    }
    return array;
}
