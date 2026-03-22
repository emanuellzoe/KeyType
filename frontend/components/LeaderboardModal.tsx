import { useState, useEffect } from "react";
import { TestStats } from "@/types";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [scores, setScores] = useState<TestStats[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedScores = localStorage.getItem("keytype_ranked_scores");
      if (savedScores) {
        setScores(JSON.parse(savedScores).sort((a: TestStats, b: TestStats) => b.wpm - a.wpm));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="results-overlay animate-fade-in-up" style={{ zIndex: 50 }}>
      <div 
        className="results-card glass-panel animate-scale-in" 
        style={{ maxWidth: '42rem', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="results-title" style={{ marginBottom: 0 }}>Ranked Leaderboard</h2>
          <button onClick={onClose} className="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {scores.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.6, padding: '2rem 0' }}>
            No ranked history yet. Play Ranked mode to see your scores here!
          </p>
        ) : (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', opacity: 0.7, fontWeight: 'bold', marginBottom: '1rem' }}>
              <div>Date</div>
              <div>WPM</div>
              <div>Accuracy</div>
              <div>Raw WPM</div>
            </div>
            {scores.map((score, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem', alignItems: 'center' }}>
                <div>{score.date ? new Date(score.date).toLocaleDateString() : 'N/A'}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#cd7f32' : 'white' }}>
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
