export type Language = "en" | "id";
export type TestMode = "practice" | "ranked";

export interface CharState {
  char: string;
  state: "pending" | "correct" | "incorrect" | "extra";
}

export interface WordState {
  chars: CharState[];
  completed: boolean;
  hasError: boolean;
}

export interface TestStats {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  time: number;
  mode: TestMode;
  date?: number;
}
