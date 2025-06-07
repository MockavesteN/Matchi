
import Board from "./components/Board";

export default function App() {
  return (
    <div className="flex flex-col items-center pt-8">
      <h1 className="text-3xl mb-4 font-semibold">Hiragana Word Match</h1>
      <Board rows={8} cols={8} />
      <p className="mt-4 text-gray-600">
        Click two adjacent tiles to swap and spell a valid Japanese word!
      </p>
    </div>
  );
}
