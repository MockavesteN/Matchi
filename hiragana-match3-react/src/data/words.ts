/**
 * Very small word list for prototype/demo.
 * Replace with a larger JMdict-derived list for production.
 */
export const wordMeanings: Record<string, string> = {
  "あい": "love",
  "あお": "blue",
  "さくら": "cherry blossom",
  "すし": "sushi",
  "ねこ": "cat",
  "いぬ": "dog",
  "かわ": "river",
  "やま": "mountain",
  "はな": "flower",
  "ゆき": "snow",
  "くも": "cloud",
  "あめ": "rain",
  "もり": "forest",
  "うみ": "sea",
  "みみ": "ear",
  "ほし": "star"
};

export const words: string[] = Object.keys(wordMeanings);
