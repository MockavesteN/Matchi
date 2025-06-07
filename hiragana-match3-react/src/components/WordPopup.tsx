import { WordInfo } from "../data/words";

interface Props {
  info: WordInfo;
  onClose: () => void;
}

export default function WordPopup({ info, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-4 rounded shadow-md text-center">
        {info.emoji && <div className="text-4xl mb-1">{info.emoji}</div>}
        <div className="text-2xl mb-2">
          {info.kana}
          {info.kanji && <span className="ml-2 text-xl text-gray-500">{info.kanji}</span>}
        </div>
        <div className="text-lg mb-1">{info.romaji}</div>
        <div className="text-lg mb-3">{info.english}</div>
        <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
