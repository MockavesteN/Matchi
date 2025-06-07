
export default class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord = false;

  insert(word: string) {
    let node: TrieNode = this;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }
    node.isWord = true;
  }

  hasWord(word: string): boolean {
    let node: TrieNode = this;
    for (const ch of word) {
      const next = node.children.get(ch);
      if (!next) return false;
      node = next;
    }
    return node.isWord;
  }

  hasPrefix(prefix: string): boolean {
    let node: TrieNode = this;
    for (const ch of prefix) {
      const next = node.children.get(ch);
      if (!next) return false;
      node = next;
    }
    return true;
  }
}
