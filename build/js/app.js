(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Starwars = function() {
  this.baseURI = 'http://swapi.co/api/';
  this.category = '';
  this.word = '';
  this.gameObject = {};
  this.solution = [];
  this.pieces = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
  this.correctLetters = 0;
  this.solutionActualLength = 0;
}

Starwars.prototype.checkForWinner = function() {
  if (this.correctLetters === this.solutionActualLength) {
    return true;
  } else {
    return false;
  }
}

Starwars.prototype.guess = function(guessedLetter, displayLetter, displayPiece) {
  var whiffed = true;
  this.solution.forEach((letter, index) => {
    if (letter === guessedLetter) {
      displayLetter(letter, index);
      whiffed = false;

      this.correctLetters += 1;
    }
  });

  if (whiffed) {
    displayPiece(guessedLetter, this.pieces[0]);
    this.pieces.splice(0, 1);
  }
}

Starwars.prototype.checkForLoser = function() {
  if (this.pieces.length === 0) {
    return true;
  } else {
    return false;
  }
}

Starwars.prototype.setupGame = function(displayGame) {
  $.get(this.baseURI)
    .then((response) => {
      this.category = this.randomSelection(response);
      this.getWord(displayGame);
    })
    .fail((error) => {
      return error;
    });
}

Starwars.prototype.getWord = function(displayGame) {
  $.get(this.baseURI + this.category)
    .then((response) => {
      this.gameObject = this.randomSelection(response.results);
      if (this.gameObject.hasOwnProperty('title')) {
        this.word = this.gameObject.title.replace(/\s/g, "-").toLowerCase();
      } else {
        this.word = this.gameObject.name.replace(/\s/g, "-").toLowerCase();
      }
    })
    .then(() => {
      this.solution = this.word.split("");

      this.solutionActualLength = this.word.replace(/-/g, '').length;

      displayGame(this.word);
    });
}

Starwars.prototype.randomSelection = function(data) {
  if (Array.isArray(data) === false) {
    data = Object.keys(data);
  }

  var randomIndex = this.randomIndex(data.length);

  return data[randomIndex];
}

Starwars.prototype.randomIndex = function(limit) {
  return Math.floor(Math.random() * limit);
}

exports.starwars = Starwars;

},{}],2:[function(require,module,exports){
var Starwars = require('./../js/starwars.js').starwars;


function displayGame(word) {
  var wordToDisplay = word.split("");
  wordToDisplay.forEach(function(letter, index) {
    if (letter === '-') {
      $('.letter-board').append(`<span class="dash">${letter}</span>`);
    } else {
      $('.letter-board').append(`<span data-index="${index}" class="letter"></span>`);
    }
  });
}

function displayLetter(letter, index) {
  $(`span[data-index="${index}"]`).text(letter);
}

function displayPiece(guessedLetter, piece) {
  $(`.${piece}`).show();
  $('.wrong-letters .body').append(`<span>${guessedLetter}</span>`);
}

$(document).ready(function() {
  var starwars = new Starwars();
  starwars.setupGame(displayGame);

  $('form').submit(function(e) {
    e.preventDefault();
    var guessedLetter = $('#guessed-letter').val();
    $('#guessed-letter').val('');
    starwars.guess(guessedLetter, displayLetter, displayPiece);

    if (starwars.checkForLoser()) {
      alert('YOU LOSE!');
    }
    if (starwars.checkForWinner()) {
      alert('YOU WINNNN!!!!!');
    }

  });
  $('#play-again').click(function(){
    window.location = window.location;
  });
});

},{"./../js/starwars.js":1}]},{},[2]);
