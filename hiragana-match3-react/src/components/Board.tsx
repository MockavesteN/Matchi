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
import { kanaSetLevel1 } from "../data/kanaSets
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

  const [trie] = useState<TrieNode>(() => {
    const t = new TrieNode();
    for (const w of words) t.insert(w);
    return t;
  });

  useEffect(() => {
    const init = generateBoard(rows, cols, kanaSetLevel1, trie);
    setBoard(init);
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
    const meaning = wordMeanings[word] || "";

    setBoard(newBoard);
    setPendingBoard(postBoard);
    setOverlay({ word, meaning });
    setSelected(null);
  };

  return (
    <>
      {foundWord && (
        <WordPopup info={foundWord} onClose={() => setFoundWord(null)} />
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
    </>
  );
}
