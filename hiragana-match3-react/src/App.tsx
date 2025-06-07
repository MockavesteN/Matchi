
import Board from "./components/Board";
import { useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="flex flex-col items-center pt-8">
      <h1 className="text-3xl mb-2 font-semibold">Hiragana Word Match</h1>
      <h2 className="text-xl mb-4">Score: {score}</h2>
      <Board rows={8} cols={8} onScore={delta => setScore(s => s + delta)} />
      <p className="mt-4 text-gray-600">
        Click two adjacent tiles to swap and spell a valid Japanese word!
      </p>
    </div>
  );
}
