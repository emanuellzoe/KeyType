import { TestStats } from "@/types";

const STORAGE_KEY = "keytype_ranked_scores";
const STORAGE_EVENT = "keytype-ranked-scores-updated";

export function readRankedScores(): TestStats[] {
  if (typeof window === "undefined") return [];

  try {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    const parsed = savedScores ? (JSON.parse(savedScores) as TestStats[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRankedScore(score: TestStats) {
  if (typeof window === "undefined") return;

  const savedScores = readRankedScores();
  savedScores.push(score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScores));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function subscribeRankedScores(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: Event) => {
    if (event instanceof StorageEvent && event.key && event.key !== STORAGE_KEY) {
      return;
    }

    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

export function getRankedScoresSnapshot() {
  return readRankedScores();
}

export function getRankedScoresServerSnapshot(): TestStats[] {
  return [];
}
