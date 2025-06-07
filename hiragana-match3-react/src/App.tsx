
import { useState } from "react";
import Board from "./components/Board";

export default function App() {
  const [mode, setMode] = useState<"learning" | "arcade" | null>(null);

  if (!mode) {
    return (
      <div className="flex flex-col items-center pt-8">
        <h1 className="text-3xl mb-6 font-semibold font-[JapaneseBrush] text-purple-700 drop-shadow">Hiragana Word Match</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setMode("learning")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Learning Mode
          </button>
          <button
            onClick={() => setMode("arcade")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Arcade Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-8">
      <h1 className="text-3xl mb-4 font-semibold font-[JapaneseBrush] text-purple-700 drop-shadow">Hiragana Word Match</h1>
      <Board rows={8} cols={8} mode={mode} />
      {mode === "learning" && (
        <p className="mt-4 text-gray-600">
          Click two adjacent tiles to swap and spell a valid Japanese word!
        </p>
      )}
    </div>
  );
}
