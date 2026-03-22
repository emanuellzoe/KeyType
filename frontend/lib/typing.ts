import { Language, WordState } from "@/types";
import { wordLists } from "./words";

export function generateWords(count: number, language: Language): string[] {
  const words: string[] = [];
  const wordPool = wordLists[language];
  for (let i = 0; i < count; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }
  return words;
}

export function buildWordStates(sourceWords: string[]): WordState[] {
  return sourceWords.map((word) => ({
    chars: word.split("").map((char) => ({ char, state: "pending" as const })),
    completed: false,
    hasError: false,
  }));
}

export function createWordSet(language: Language) {
  const words = generateWords(100, language);
  return {
    words,
    states: buildWordStates(words),
  };
}
