import { useMemo, useSyncExternalStore } from "react";
import {
  getRankedScoresServerSnapshot,
  getRankedScoresSnapshot,
  subscribeRankedScores,
} from "@/lib/rankedScores";
import { TestStats } from "@/types";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const rankedScores = useSyncExternalStore(
    subscribeRankedScores,
    getRankedScoresSnapshot,
    getRankedScoresServerSnapshot
  );
  const scores = useMemo(
    () => [...rankedScores].sort((a: TestStats, b: TestStats) => b.wpm - a.wpm),
    [rankedScores]
  );

  if (!isOpen) return null;

  const bestScore = scores[0]?.wpm ?? 0;

  return (
    <div className="results-overlay animate-fade-in-up" style={{ zIndex: 50 }}>
      <div className="leaderboard-card animate-scale-in">
        <div className="leaderboard-header">
          <div>
            <p className="results-kicker">ranked history</p>
            <h2 className="results-title">Local leaderboard</h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="leaderboard-summary">
          <div className="leaderboard-summary-item">
            <span>saved runs</span>
            <strong>{scores.length}</strong>
          </div>
          <div className="leaderboard-summary-item">
            <span>best score</span>
            <strong>{bestScore > 0 ? `${bestScore} wpm` : "0 wpm"}</strong>
          </div>
        </div>

        {scores.length === 0 ? (
          <p className="leaderboard-empty">
            No ranked history yet. Play Ranked mode to see your scores here!
          </p>
        ) : (
          <div className="leaderboard-table">
            <div className="leaderboard-row leaderboard-row-head">
              <div>run</div>
              <div>date</div>
              <div>wpm</div>
              <div>accuracy</div>
              <div>raw</div>
            </div>
            {scores.map((score, idx) => (
              <div key={`${score.date}-${idx}`} className="leaderboard-row">
                <div className={`leaderboard-rank ${idx < 3 ? `top-${idx + 1}` : ""}`}>#{idx + 1}</div>
                <div>{score.date ? new Date(score.date).toLocaleDateString(undefined, { dateStyle: "medium" }) : "N/A"}</div>
                <div className="leaderboard-score">
                  {score.wpm}
                </div>
                <div>{score.accuracy}%</div>
                <div>{score.rawWpm}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
