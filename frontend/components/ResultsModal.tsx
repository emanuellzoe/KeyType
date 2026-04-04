import { TestStats } from "@/types";

interface ResultsModalProps {
  stats: TestStats;
  wordsCount: number;
  onRestart: () => void;
}

export function ResultsModal({ stats, wordsCount, onRestart }: ResultsModalProps) {
  return (
    <div className="results-overlay animate-fade-in-up">
      <div className="results-card animate-scale-in">
        <p className="results-kicker">
          {stats.mode === "ranked" ? "ranked result" : "practice result"}
        </p>
        <h2 className="results-title">Session complete</h2>
        <p className="results-copy">
          {stats.mode === "ranked"
            ? "Your run has been saved to the local leaderboard. Jump straight back in whenever you want another shot."
            : "Reset and keep building rhythm. The cleaner layout is new, but the old KeyType flow is still intact."}
        </p>

        <div className="results-grid">
          <div>
            <p className="results-value">{stats.wpm}</p>
            <p className="results-label">WPM</p>
          </div>
          <div>
            <p className="results-value">{stats.accuracy}%</p>
            <p className="results-label">Accuracy</p>
          </div>
          <div>
            <p className="results-value">{stats.rawWpm}</p>
            <p className="results-label">Raw WPM</p>
          </div>
          <div>
            <p className="results-value">{wordsCount}</p>
            <p className="results-label">Words</p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-primary w-full flex items-center justify-center gap-2"
          style={{ marginTop: "1.5rem" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart test
        </button>
      </div>
    </div>
  );
}
