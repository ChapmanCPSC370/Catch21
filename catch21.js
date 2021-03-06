/*
* Garrett Olsen
* garrettolsen333@gmail.com
*
* A simple javascript program for playing a game of catch21, a game similar to blackjack
* simulates 100 rounds and prints metrics to console
*/


// used for generating a random suit
var suitArr = ['S', 'H', 'C', 'D'];
var rankArr = [2,3,4,5,6,7,8,9,10,11,12,13,14];

var deckMatrix = {'S':[0,0,0,0,0,0,0,0,0,0,0,0,0], 'H':[0,0,0,0,0,0,0,0,0,0,0,0,0], 'C':[0,0,0,0,0,0,0,0,0,0,0,0,0], 'D':[0,0,0,0,0,0,0,0,0,0,0,0,0]};


// Card Class
function Card(rank, suit) {

	this.rank = rank;
	this.suit = suit;

	this.getCardString = function() {
		if(this.rank === 11) {
			return "J of " + this.suit;
		}
		else if(this.rank === 12) {
			return "Q of " + this.suit;
		}
		else if(this.rank === 13) {
			return "K of " + this.suit;
		}
		else if(this.rank === 14) {
			return "A of " + this.suit;
		}
		else {
			return this.rank + " of " + this.suit;
		}
	}

	this.getCardValue = function() {
		if(this.rank < 10) {
			return this.rank;
		}
		else if(this.rank === 14) {
			return 11;
		}
		else {
			return 10;
		}
	}
}



// Deck Class
function Deck() {

	this.deck = []; // stack for the deck
	this.deckSize = 0;

	// validates the card generated across the deckMatrix
	this.checkCard = function(rank, suit) {

		if(suit === 'S') {
			if(deckMatrix.S[rank] === 0) {
				return true;
			}
		}
		else if(suit === 'H') {
			if(deckMatrix.H[rank] === 0) {
				return true;
			}
		}
		else if(suit === 'C') {
			if(deckMatrix.C[rank] === 0) {
				return true;
			}
		}
		else {
			if(deckMatrix.D[rank] === 0) {
				return true;
			}
		}

		return false;
	}

	// generates random numbers used to access the deckMatrix and value arrays 
	this.generateRandomCard = function() {
		while(true) {
			var rankGen = Math.floor(Math.random()*13);
			var suitGen = Math.floor(Math.random()*4);
			var s = suitArr[suitGen];
			if(this.checkCard(rankGen, s)) {
				var c = new Card(rankArr[rankGen], s);
				return c;
			}
		}
	}

	this.generateDeck = function() {
		while(this.deckSize < 52) {
			var c = this.generateRandomCard();
			this.deck.push(c);
			++this.deckSize;
		}
	}

	this.destroy = function() {
		while(this.deckSize > 0) {
			this.deck.pop();
			--this.deckSize;
		}
	}
}


// Player Class
function Player() {

	this.chipsLeft = 100; // start with 100 chips
	this.roundsPlayed = 0;
	this.currentPoints = 0;
	this.dealerPoints = 0;
	this.roundsWon = 0;
	this.numTies = 0;
	this.bothBust = 0;

	this.loseChips = function() {
		this.chipsLeft -= 10;
		++this.roundsPlayed;
	}

	this.winChips = function() {
		this.chipsLeft += 10;
		++this.roundsPlayed;
		++this.roundsWon;
	}
}



var deck = new Deck();
var player = new Player();


var checkPoints = function() {
	if(player.dealerPoints > 21) {
		if(player.currentPoints > 21) {
			player.bothBust++;
			player.numTies++;
			player.roundsPlayed++;
		}
		else {
			player.winChips();
		}
	}
	else if(player.dealerPoints === 21) {
		player.loseChips();
	}
	else if(player.dealerPoints < 21) {
		if(player.currentPoints > player.dealerPoints) {
			player.winChips();
		}
	}
}

var simulateRound = function(count) {

	var deck = new Deck();

	console.log("Round " + count);
	while(player.currentPoints < 21 || player.dealerPoints < 21) {
		var c = deck.generateRandomCard();
		player.currentPoints += c.getCardValue();
		var c2 = deck.generateRandomCard();
		player.dealerPoints += c2.getCardValue();
		console.log(c.getCardString() + " vs " + c2.getCardString());
	
		checkPoints();
	}

	player.currentPoints = 0;
	player.dealerPoints = 0;
}

var count = 0;
var errCount = 0;
while(count < 100) {
	simulateRound(count);
	count++;
}

console.log("");
console.log("Rounds Won / Rounds Played :" + player.roundsWon + " / " + player.roundsPlayed);
console.log("Chips Gained/Lost: " + player.chipsLeft);
console.log("Number of Ties: " + player.numTies);