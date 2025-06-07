

import { useEffect, useState, useRef } from "react";
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
import { words, wordMeanings } from "../data/words";
import { Tile as TileType } from "../types";
import KanjiPop from "../animations/KanjiPop";

interface Props {
  rows: number;
  cols: number;
  onScore?: (delta: number) => void;
}

interface Coord {
  r: number;
  c: number;
}

export default function Board({ rows, cols, onScore }: Props) {
  const [board, setBoard] = useState<TileType[][]>([]);
  const [selected, setSelected] = useState<Coord | null>(null);

  const [popWord, setPopWord] = useState<string | null>(null);
  const matchSoundRef = useRef<HTMLAudioElement | null>(null);

  const [trie] = useState<TrieNode>(() => {
    const t = new TrieNode();
    for (const w of words) t.insert(w);
    return t;
  });

  useEffect(() => {
    const init = generateBoard(rows, cols, kanaSetLevel1, trie);
    setBoard(init);
  }, [rows, cols, trie]);

  useEffect(() => {
    matchSoundRef.current = new Audio("/sounds/pon.mp3");
  }, []);

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


    const wordsMatched = matches.map(group =>
      group.map(([mr, mc]) => newBoard[mr][mc].kana).join("")
    );

    if (matchSoundRef.current) {
      matchSoundRef.current.currentTime = 0;
      matchSoundRef.current.play();
    }

    if (wordsMatched[0]) {
      setPopWord(wordsMatched[0]);
      setTimeout(() => setPopWord(null), 800);
    }

    const delta = wordsMatched.reduce((sum, w) => sum + w.length, 0);
    if (delta > 0 && onScore) onScore(delta);

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
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 3.25rem)`
      }}
    >
      {popWord && <KanjiPop text={popWord} />}
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
