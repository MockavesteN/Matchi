import { useEffect, useState } from "react";
import Tile from "./Tile";
import MeaningOverlay from "./MeaningOverlay";
import TrieNode from "../game/Trie";
import {
  generateBoard,
  swap,
  findWords,
  collapseAndRefill,
  hasLegalMove
} from "../game/BoardLogic";
import { kanaSetLevel1 } from "../data/kanaSets";
import { words, wordsMap, WordInfo } from "../data/words";
import WordPopup from "./WordPopup";

import { Tile as TileType } from "../types";

interface Props {
  rows: number;
  cols: number;
}

interface Coord {
  r: number;
  c: number;
}

export default function Board({ rows, cols }: Props) {
  const [board, setBoard] = useState<TileType[][]>([]);
  const [selected, setSelected] = useState<Coord | null>(null);
  const [foundWord, setFoundWord] = useState<WordInfo | null>(null);
  const [overlay, setOverlay] = useState<{ word: string; meaning: string } | null>(null);
  const [pendingBoard, setPendingBoard] = useState<TileType[][] | null>(null);

  const [trie] = useState<TrieNode>(() => {
    const t = new TrieNode();
    for (const w of words) t.insert(w);
    return t;
  });

  useEffect(() => {
    const init = generateBoard(rows, cols, kanaSetLevel1, trie);
    setBoard(init);

    // Debug: Check for words on initial board
    const wordsOnBoard = findWords(init, trie);
    if (wordsOnBoard.length > 0) {
      console.log("Words found on initial board:", wordsOnBoard.map(group =>
        group.map(([r, c]) => init[r][c].kana).join("")
      ));
    }
  }, [rows, cols, trie]);

  const handleClick = (r: number, c: number) => {
    if (!board.length || overlay) return;
    if (!selected) {
      setSelected({ r, c });
      return;
    }
    const { r: sr, c: sc } = selected;
    if (sr === r && sc === c) {
      setSelected(null);
      return;
    }
    if (Math.abs(sr - r) + Math.abs(sc - c) !== 1) {
      setSelected({ r, c });
      return;
    }

    const newBoard = board.map(row => row.map(t => ({ ...t })));
    if (!swap(newBoard, sr, sc, r, c)) {
      setSelected(null);
      return;
    }

    const matches = findWords(newBoard, trie);
    if (matches.length === 0) {
      setSelected(null);
      return;
    }


    const matchedKana = matches
      .map(group => group.map(([gr, gc]) => newBoard[gr][gc].kana).join(""))[0];
    if (matchedKana && wordsMap[matchedKana]) {
      setFoundWord(wordsMap[matchedKana]);
    } else {
      setFoundWord(null);
    }

    // Clear matches

    const cleared = Array.from({ length: rows }, () =>
      Array(cols).fill(false)
    );
    for (const group of matches) {
      for (const [gr, gc] of group) {
        cleared[gr][gc] = true;
      }
    }

    const boardForCollapse = newBoard.map(row => row.map(t => ({ ...t })));
    let postBoard = collapseAndRefill(boardForCollapse, cleared, kanaSetLevel1);
    let loopGuard = 0;
    while (loopGuard < 10) {
      const cascaded = findWords(postBoard, trie);
      if (cascaded.length === 0) break;
      const clearCascade = Array.from({ length: rows }, () =>
        Array(cols).fill(false)
      );
      for (const group of cascaded) {
        for (const [gr, gc] of group) {
          clearCascade[gr][gc] = true;
        }
      }
      postBoard = collapseAndRefill(postBoard, clearCascade, kanaSetLevel1);
      loopGuard++;
    }

    if (!hasLegalMove(postBoard, trie)) {
      postBoard = generateBoard(rows, cols, kanaSetLevel1, trie);
    }

    const word = matches[0].map(([mr, mc]) => newBoard[mr][mc].kana).join("");
    const meaning = wordsMap[word]?.meaning || "";

    setBoard(newBoard);
    setPendingBoard(postBoard);
    setOverlay({ word, meaning });
    setSelected(null);
  };

  const debugCheckWords = () => {
    const wordsOnBoard = findWords(board, trie);
    console.log("Current words on board:", wordsOnBoard.map(group =>
      group.map(([r, c]) => board[r][c].kana).join("")
    ));
    alert(`Found ${wordsOnBoard.length} words: ${wordsOnBoard.map(group =>
      group.map(([r, c]) => board[r][c].kana).join("")
    ).join(", ")}`);
  };

  return (
    <>
      {foundWord && (
        <WordPopup info={foundWord} onClose={() => setFoundWord(null)} />
      )}
      <div className="mb-4">
        <button
          onClick={debugCheckWords}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Debug: Check for Words
        </button>
      </div>
      <div className="relative inline-block">
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 3.25rem)`
        }}
      >
        {board.map((row, r) =>
          row.map((tile, c) => (
            <Tile
              key={tile.id}
              tile={tile}
              onClick={() => handleClick(r, c)}
              selected={selected?.r === r && selected?.c === c}
            />
          ))
        )}
      </div>
      {overlay && (
        <MeaningOverlay
          word={overlay.word}
          meaning={overlay.meaning}
          onDismiss={() => {
            if (pendingBoard) {
              setBoard(pendingBoard);
              setTimeout(
                () =>
                  setBoard(prev =>
                    prev.map(row => row.map(t => ({ ...t, isNew: false })))
                  ),
                300
              );
            }
            setPendingBoard(null);
            setOverlay(null);
          }}
        />
      )}
      </div>
    </>
  );
}
