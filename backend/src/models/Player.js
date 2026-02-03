export class Player {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.score = data.score || 0;
    this.hasGuessed = data.hasGuessed || false;
    this.guessTime = data.guessTime || null;
    this.wrongGuesses = data.wrongGuesses || 0;
    this.isDrawing = data.isDrawing || false;
  }

  resetTurn() {
    this.hasGuessed = false;
    this.guessTime = null;
    this.wrongGuesses = 0;
    this.isDrawing = false;
  }

  addScore(points) {
    this.score += points;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      score: this.score,
      hasGuessed: this.hasGuessed,
      isDrawing: this.isDrawing
    };
  }
}
