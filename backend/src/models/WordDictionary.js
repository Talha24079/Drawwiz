export const defaultWordDictionary = {
  Animals: [
    'dog', 'cat', 'elephant', 'lion', 'tiger', 'bear', 'monkey', 'giraffe', 
    'zebra', 'kangaroo', 'penguin', 'dolphin', 'shark', 'eagle', 'owl',
    'butterfly', 'snake', 'crocodile', 'hippopotamus', 'rhinoceros'
  ],
  Objects: [
    'chair', 'table', 'lamp', 'book', 'phone', 'computer', 'car', 'bicycle',
    'umbrella', 'clock', 'mirror', 'camera', 'guitar', 'piano', 'television',
    'refrigerator', 'microwave', 'toaster', 'scissors', 'hammer'
  ],
  'Famous Places': [
    'eiffel tower', 'statue of liberty', 'taj mahal', 'great wall of china',
    'colosseum', 'pyramids', 'big ben', 'stonehenge', 'mount everest',
    'niagara falls', 'grand canyon', 'minar-e-pakistan', 'burj khalifa',
    'sydney opera house', 'machu picchu', 'angkor wat', 'petra'
  ],
  Movies: [
    'titanic', 'avatar', 'inception', 'matrix', 'star wars', 'harry potter',
    'lord of the rings', 'jurassic park', 'avengers', 'batman', 'superman',
    'spiderman', 'frozen', 'lion king', 'finding nemo', 'toy story'
  ],
  'General Vocabulary': [
    'happiness', 'freedom', 'mountain', 'ocean', 'sunset', 'rainbow',
    'friendship', 'family', 'birthday', 'celebration', 'adventure',
    'treasure', 'castle', 'dragon', 'pirate', 'knight', 'princess',
    'wizard', 'magic', 'dream', 'dance', 'music', 'paint', 'draw'
  ]
};

export class WordDictionary {
  constructor() {
    this.categories = { ...defaultWordDictionary };
  }

  getAllWords() {
    const allWords = [];
    for (const category in this.categories) {
      allWords.push(...this.categories[category]);
    }
    return allWords;
  }

  getWordsByCategory(category) {
    return this.categories[category] || [];
  }

  getRandomWords(count = 3, customWords = []) {
    const allWords = customWords.length > 0 ? customWords : this.getAllWords();
    const shuffled = allWords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  addCustomWords(words) {
    if (!this.categories['Custom']) {
      this.categories['Custom'] = [];
    }
    this.categories['Custom'].push(...words);
  }
}
