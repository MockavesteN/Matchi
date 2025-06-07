interface Props {
  word: string;
  meaning: string;
  onDismiss: () => void;
}

export default function MeaningOverlay({ word, meaning, onDismiss }: Props) {
  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 cursor-pointer"
      onClick={onDismiss}
    >
      <div className="bg-white p-4 rounded shadow text-center text-xl">
        <div className="text-2xl mb-2 font-bold">{word}</div>
        <div>{meaning}</div>
        <div className="text-sm mt-2 text-gray-500">Click to continue</div>
      </div>
    </div>
  );
}
