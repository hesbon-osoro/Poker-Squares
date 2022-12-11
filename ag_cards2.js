"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Review Assignment

   Author: Hesbon Osoro
   Date: 12/11/22  

   Filename: ag_cards2.js


   Custom Object Classes
   
   squareGame
      The squareGame object contains properties and methods for the game
      of Poker Squares

   pokerDeck
      The pokerDeck object contains an array of poker cards and methods
      for shuffling and drawing cards from the deck.

   pokerHand
      The pokerHand object contains an array of poker cards drawn from a
      poker deck. The methods associated with the object include the ability 
      to calculate the value of the hand and to mark cards to be discarded,
      replaced with new cards from a poker deck.

   pokerCard
      The pokerCard object contains properties and methods associated with
      individual poker cards including the card rank, suit, and value.
   
	
*/

/*    The squareGame Object  */
var squareGame = {
  cardGrid: [
    new pokerHand(),
    new pokerHand(),
    new pokerHand(),
    new pokerHand(),
    new pokerHand(),
  ],

  calcRowPoints: function (index) {
    return this.cardGrid[index].handPoints();
  },

  calcColumnPoints: function (index) {
    var columnHand = new pokerHand(5);
    for (var i = 0; i < 5; i++) {
      columnHand.cards[i] = this.cardGrid[i].cards[index];
    }
    return columnHand.handPoints();
  },
  gameTotal: 0,
  winTotal: 50,
  gameResult: function () {
    if (this.gameTotal >= this.winTotal) {
      return "Winner";
    } else {
      return "No Winner";
    }
  },
};

/* Method to insert a card into a poker hand at a specified index */
pokerHand.prototype.insertCard = function (card, index) {
  this.cards[index] = card;
};

/* ------- Poker Style Custom Objects ---------- */

/* Constructor function for poker cards */
function pokerCard(cardSuit, cardRank) {
  this.suit = cardSuit;
  this.rank = cardRank;
  this.rankValue = null;
}

/* Method to reference the image source file for a card */
pokerCard.prototype.cardImage = function () {
  var suitAbbr = this.suit.substring(0, 1).toLowerCase();
  return suitAbbr + this.rankValue + ".png";
};

/* Method to replace a card with a one from the deck */
pokerCard.prototype.replaceFromDeck = function (pokerDeck) {
  this.suit = pokerDeck.cards[0].suit;
  this.rank = pokerDeck.cards[0].rank;
  this.rankValue = pokerDeck.cards[0].rankValue;
  pokerDeck.cards.shift();
};

/* Constructor function for poker decks */
function pokerDeck() {
  this.cards = new Array(52);

  var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
  var ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];

  var cardCount = 0;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 13; j++) {
      this.cards[cardCount] = new pokerCard(suits[i], ranks[j]);
      this.cards[cardCount].rankValue = j + 2;
      cardCount++;
    }
  }

  // Method to randomly sort the deck
  this.shuffle = function () {
    this.cards.sort(function () {
      return 0.5 - Math.random();
    });
  };

  // Method to deal cards from the deck into a poker hand
  this.dealTo = function (pokerHand) {
    for (var i = 0; i < pokerHand.cards.length; i++) {
      pokerHand.cards[i] = this.cards.shift();
    }
  };
}

/* Constructor function for poker hands */
function pokerHand(handLength) {
  this.cards = new Array(handLength);
}

/* Return the highest ranked card in the hand */
pokerHand.prototype.highCard = function () {
  return Math.max.call(
    pokerHand,
    this.cards[0].rankValue,
    this.cards[1].rankValue,
    this.cards[2].rankValue,
    this.cards[3].rankValue,
    this.cards[4].rankValue
  );
};

/* Test for the presence of a flush */
pokerHand.prototype.hasFlush = function () {
  var firstSuit = this.cards[0].suit;
  return this.cards.every(function (card) {
    return card.suit === firstSuit;
  });
};

/* Test for the presence of a straight */
pokerHand.prototype.hasStraight = function () {
  var cardArray = this.cards.map(function (card) {
    return card.rankValue;
  });
  cardArray.sort(function (a, b) {
    return a - b;
  });

  return cardArray.every(function (card, i, cards) {
    if (i > 0) {
      return cards[i] - cards[i - 1] === 1;
    } else {
      return true;
    }
  });
};

/* Test for the presence of a straight flush */
pokerHand.prototype.hasStraightFlush = function () {
  return this.hasFlush() && this.hasStraight();
};

/* Test for the presence of a royal flush */
pokerHand.prototype.hasRoyalFlush = function () {
  return this.hasStraightFlush() && this.highCard() === 14;
};

/* Test for duplicates in the hand */
pokerHand.prototype.hasSets = function () {
  // handSets summarizes the duplicates the hand
  var handSets = {};
  this.cards.forEach(function (card) {
    if (handSets.hasOwnProperty(card.rankValue)) {
      handSets[card.rankValue]++;
    } else {
      handSets[card.rankValue] = 1;
    }
  });

  var sets = "none";

  for (var cardRank in handSets) {
    if (handSets[cardRank] === 4) {
      sets = "Four of a Kind";
    }
    if (handSets[cardRank] === 3) {
      if (sets === "Pair") {
        sets = "Full House";
      } else {
        sets = "Three of a Kind";
      }
    }
    if (handSets[cardRank] === 2) {
      if (sets === "Three of a Kind") {
        sets = "Full House";
      } else if (sets === "Pair") {
        sets = "Two Pair";
      } else {
        sets = "Pair";
      }
    }
  }

  return sets;
};

/* Returns the type of poker hand */
pokerHand.prototype.handType = function () {
  if (this.hasRoyalFlush()) {
    return "Royal Flush";
  } else if (this.hasStraightFlush()) {
    return "Straight Flush";
  } else if (this.hasFlush()) {
    return "Flush";
  } else if (this.hasStraight()) {
    return "Straight";
  } else {
    return this.hasSets();
  }
};

/* Returns the point total for each hand */
pokerHand.prototype.handPoints = function () {
  switch (this.handType()) {
    case "Royal Flush":
      return 30;
    case "Straight Flush":
      return 30;
    case "Four of a Kind":
      return 16;
    case "Full House":
      return 10;
    case "Flush":
      return 5;
    case "Straight":
      return 12;
    case "Three of a Kind":
      return 6;
    case "Two Pair":
      return 3;
    case "Pair":
      return 1;
    default:
      return 0;
  }
};
