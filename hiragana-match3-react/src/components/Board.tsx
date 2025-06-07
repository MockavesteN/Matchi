
import { useEffect, useState } from "react";
import Tile from "./Tile";
import TrieNode from "../game/Trie";
import {
  generateBoard,
  swap,
  findWords,
  collapseAndRefill,
  hasLegalMove
} from "../game/BoardLogic";
import { kanaSetLevel1 } from "../data/kanaSets";
import { words } from "../data/words";
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
  const [trie] = useState<TrieNode>(() => {
    const t = new TrieNode();
    for (const w of words) t.insert(w);
    return t;
  });

  // Initial board
  useEffect(() => {
    const init = generateBoard(rows, cols, kanaSetLevel1, trie);
    setBoard(init);
  }, [rows, cols, trie]);

  const handleClick = (r: number, c: number) => {
    if (!board.length) return;
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

    const newBoard = board.map(row => row.slice());
    if (!swap(newBoard, sr, sc, r, c)) {
      setSelected(null);
      return;
    }

    const matches = findWords(newBoard, trie);
    if (matches.length === 0) {
      // illegal swap, revert
      setSelected(null);
      return;
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

    let postBoard = collapseAndRefill(newBoard, cleared, kanaSetLevel1);
    // cascading
    let loopGuard = 0;
    while (loopGuard < 10) {
      const cascaded = findWords(postBoard, trie);
      if (cascaded.length === 0) break;
      // clear & refill cascading words
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

    // Ensure board still solvable
    if (!hasLegalMove(postBoard, trie)) {
      postBoard = generateBoard(rows, cols, kanaSetLevel1, trie);
    }

    setBoard(postBoard);
    setSelected(null);
  };

  return (
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
  );
}
