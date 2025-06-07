
import TrieNode from "./Trie";
import { Tile } from "../types";

/**
 * Generate a random tile from kana set.
 */
export function randomTile(kanaSet: string[], markNew = false): Tile {
  const kana = kanaSet[Math.floor(Math.random() * kanaSet.length)];
  return { kana, id: crypto.randomUUID(), isNew: markNew };
}

/**
 * Create an initial board that has at least one legal move
 * and contains no pre‑made words.
 */
export function generateBoard(
  rows: number,
  cols: number,
  kanaSet: string[],
  trie: TrieNode
): Tile[][] {
  let board: Tile[][] = [];
  let safety = 0;
  do {
    board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => randomTile(kanaSet))
    );
    safety++;

    const foundWords = findWords(board, trie);
    if (foundWords.length > 0) {
      console.log("Board generation found words:", foundWords.map(group =>
        group.map(([r, c]) => board[r][c].kana).join("")
      ));
    }

    // break safety loop just in case
    if (safety > 200) {
      console.warn("Board generation safety limit reached, using current board");
      break;
    }
  } while (findWords(board, trie).length > 0 || !hasLegalMove(board, trie));

  // Final check
  const finalWords = findWords(board, trie);
  if (finalWords.length > 0) {
    console.error("Generated board still contains words:", finalWords.map(group =>
      group.map(([r, c]) => board[r][c].kana).join("")
    ));
  }

  return board;
}

/**
 * Swap tiles in place. Returns false if positions not adjacent.
 */
export function swap(board: Tile[][], r1: number, c1: number, r2: number, c2: number): boolean {
  if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return false;
  const temp = board[r1][c1];
  board[r1][c1] = board[r2][c2];
  board[r2][c2] = temp;
  return true;
}

/**
 * Find all horizontal and vertical words on the board.
 * Returns array of arrays of positions belonging to each word.
 */
export function findWords(board: Tile[][], trie: TrieNode): number[][][] {
  const matches: number[][][] = [];
  const rows = board.length;
  const cols = board[0].length;

  // Horizontal scan
  for (let r = 0; r < rows; r++) {
    let start = 0;
    let current = "";
    for (let c = 0; c < cols; c++) {
      current += board[r][c].kana;
      if (!trie.hasPrefix(current)) {
        // shrink window from left
        while (current && !trie.hasPrefix(current)) {
          current = current.slice(board[r][start].kana.length);
          start++;
        }
      }
      if (current && trie.hasWord(current) && current.length >= 2) {
        const wordLen = current.length;
        const positions: number[][] = [];
        let spanLen = 0;
        let k = start;
        while (spanLen < wordLen && k <= c) {
          positions.push([r, k]);
          spanLen += board[r][k].kana.length;
          k++;
        }
        matches.push(positions);
        // move window past the found word
        current = "";
        start = c + 1;
      }
    }
  }

  // Vertical scan
  for (let c = 0; c < cols; c++) {
    let start = 0;
    let current = "";
    for (let r = 0; r < rows; r++) {
      current += board[r][c].kana;
      if (!trie.hasPrefix(current)) {
        while (current && !trie.hasPrefix(current)) {
          current = current.slice(board[start][c].kana.length);
          start++;
        }
      }
      if (current && trie.hasWord(current) && current.length >= 2) {
        const positions: number[][] = [];
        let spanLen = 0;
        let k = start;
        while (spanLen < current.length && k <= r) {
          positions.push([k, c]);
          spanLen += board[k][c].kana.length;
          k++;
        }
        matches.push(positions);
        current = "";
        start = r + 1;
      }
    }
  }

  return matches;
}

/**
 * Return true if any swap in board will create at least one word.
 * Optimized: only check neighbor swaps and corresponding row/col.
 */
export function hasLegalMove(board: Tile[][], trie: TrieNode): boolean {
  const rows = board.length;
  const cols = board[0].length;

  const boardCopy = (b: Tile[][]) => b.map(row => row.map(cell => ({ ...cell })));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const [dr, dc] of [
        [0, 1],
        [1, 0]
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= rows || nc >= cols) continue;
        const clone = boardCopy(board);
        swap(clone, r, c, nr, nc);
        if (findWords(clone, trie).length > 0) return true;
      }
    }
  }
  return false;
}

/**
 * Collapse the board after clearing tiles, fill new tiles.
 * Returns a fresh board reference.
 */
export function collapseAndRefill(
  board: Tile[][],
  cleared: boolean[][],
  kanaSet: string[]
): Tile[][] {
  const rows = board.length;
  const cols = board[0].length;

  for (let c = 0; c < cols; c++) {
    const column: Tile[] = [];
    // collect non‑cleared tiles top → bottom
    for (let r = 0; r < rows; r++) {
      if (!cleared[r][c]) column.push(board[r][c]);
    }
    // add new tiles on top
    while (column.length < rows) {
      column.unshift(randomTile(kanaSet, true));
    }
    // write back
    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];
    }
  }
  return board;
}
