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
