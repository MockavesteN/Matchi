import { findWords, collapseAndRefill, randomTile } from './BoardLogic';
import TrieNode from './Trie';
import { Tile } from '../types';

describe('findWords', () => {
  let trie: TrieNode;
  beforeEach(() => {
    trie = new TrieNode();
    trie.insert('あい');
  });

  test('detects horizontal words', () => {
    const board: Tile[][] = [
      [{ kana: 'あ', id: '1' }, { kana: 'い', id: '2' }],
      [{ kana: 'え', id: '3' }, { kana: 'お', id: '4' }]
    ];
    const words = findWords(board, trie);
    expect(words).toEqual([[
      [0, 0], [0, 1]
    ]]);
  });

  test('detects vertical words', () => {
    const board: Tile[][] = [
      [{ kana: 'あ', id: '1' }],
      [{ kana: 'い', id: '2' }]
    ];
    const words = findWords(board, trie);
    expect(words).toEqual([[
      [0, 0], [1, 0]
    ]]);
  });
});

describe('collapseAndRefill', () => {
  test('collapses cleared tiles and refills new ones', () => {
    const board: Tile[][] = [
      [{ kana: 'あ', id: '1' }],
      [{ kana: 'い', id: '2' }],
      [{ kana: 'う', id: '3' }]
    ];
    const cleared = [
      [false],
      [true],
      [false]
    ];
    const newTile: Tile = { kana: 'か', id: 'new' };
    jest.spyOn(require('./BoardLogic'), 'randomTile').mockReturnValueOnce(newTile);

    const result = collapseAndRefill(board, cleared, ['か']);
    expect(result).toEqual([
      [newTile],
      [{ kana: 'あ', id: '1' }],
      [{ kana: 'う', id: '3' }]
    ]);
  });
});
