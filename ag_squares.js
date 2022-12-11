"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Review Assignment

   Author: Hesbon Osoro
   Date: 12/11/22 
   
   Filename: ag_squares.js

*/

window.addEventListener("load", playPokerSquares);

function playPokerSquares() {
  var newCard = document.getElementById("newCard");
  var startButton = document.getElementById("startButton");
  var rowSumCells = document.querySelectorAll("table#grid th.rowsum");
  var colSumCells = document.querySelectorAll("table#grid th.colsum");
  var cardImages = document.querySelectorAll("table#grid tr td img");
  var gameScore = document.getElementById("gameScore");
  var gameResult = document.getElementById("gameResult");

  // Add your code here
  startButton.onclick = function () {
    squareGame.gameTotal = 0;
    gameScore.value = "";
    gameResult.textContent = "";
    for (var i = 0; i < rowSumCells.length; i++) {
      rowSumCells[i].textContent = "";
    }
    for (var i = 0; i < colSumCells.length; i++) {
      colSumCells[i].textContent = "";
    }
    for (var i = 0; i < cardImages.length; i++) {
      cardImages[i].src = "ag_trans.gif";
    }
    var myDeck = new pokerDeck();
    myDeck.shuffle();
    var myStarterCard = new pokerCard();
    myStarterCard = myDeck.cards.shift();
    newCard.src = myStarterCard.cardImage();
    for (var i = 0; i < cardImages.length; i++) {
      cardImages[i].onclick = function (e) {
        e.target.src = myStarterCard.cardImage();
        var rowNum = e.target.id.charAt(1);
        var colNum = e.target.id.charAt(2);
        squareGame.cardGrid[rowNum].insertCard(myStarterCard, colNum);
        e.target.onclick = null;
        if (myDeck.cards.length > 27) {
          myStarterCard = myDeck.cards.shift();
          newCard.src = myStarterCard.cardImage();
        } else {
          newCard.src = "ag_cardback3.png";
          for (var i = 0; i < 5; i++) {
            var rowTotal = squareGame.calcRowPoints(i);
            squareGame.gameTotal += rowTotal;
            rowSumCells[i].textContent = rowTotal;
          }
          for (var i = 0; i < 5; i++) {
            var colTotal = squareGame.calcColumnPoints(i);
            squareGame.gameTotal += colTotal;
            colSumCells[i].textContent = colTotal;
          }
          gameScore.value = squareGame.gameTotal;
          gameResult.textContent = squareGame.gameResult();
        }
      };
    }
  };
}
