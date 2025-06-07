
/**
 * Very small word list for prototype/demo.
 * Replace with a larger JMdict-derived list for production.
 */
export interface WordInfo {
  kana: string;
  romaji: string;
  english: string;
  kanji?: string;
  emoji?: string;
}

export const wordsInfo: WordInfo[] = [
  { kana: "あい", romaji: "ai", english: "love", kanji: "愛", emoji: "❤️" },
  { kana: "あお", romaji: "ao", english: "blue", kanji: "青", emoji: "🔵" },
  { kana: "さくら", romaji: "sakura", english: "cherry blossom", kanji: "桜", emoji: "🌸" },
  { kana: "すし", romaji: "sushi", english: "sushi", kanji: "寿司", emoji: "🍣" },
  { kana: "ねこ", romaji: "neko", english: "cat", kanji: "猫", emoji: "🐱" },
  { kana: "いぬ", romaji: "inu", english: "dog", kanji: "犬", emoji: "🐶" },
  { kana: "かわ", romaji: "kawa", english: "river", kanji: "川", emoji: "🏞️" },
  { kana: "やま", romaji: "yama", english: "mountain", kanji: "山", emoji: "⛰️" },
  { kana: "はな", romaji: "hana", english: "flower", kanji: "花", emoji: "🌺" },
  { kana: "ゆき", romaji: "yuki", english: "snow", kanji: "雪", emoji: "❄️" },
  { kana: "くも", romaji: "kumo", english: "cloud", kanji: "雲", emoji: "☁️" },
  { kana: "あめ", romaji: "ame", english: "rain", kanji: "雨", emoji: "🌧️" },
  { kana: "もり", romaji: "mori", english: "forest", kanji: "森", emoji: "🌳" },
  { kana: "うみ", romaji: "umi", english: "sea", kanji: "海", emoji: "🌊" },
  { kana: "みみ", romaji: "mimi", english: "ear", kanji: "耳", emoji: "👂" },
  { kana: "ほし", romaji: "hoshi", english: "star", kanji: "星", emoji: "⭐" },
  { kana: "りんご", romaji: "ringo", english: "apple", kanji: "林檎", emoji: "🍎" }
];

export const words: string[] = wordsInfo.map(w => w.kana);

export const wordsMap: Record<string, WordInfo> = Object.fromEntries(
  wordsInfo.map(w => [w.kana, w])
);
