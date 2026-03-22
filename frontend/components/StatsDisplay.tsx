interface StatsDisplayProps {
  displayedTime: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  smoothProgress: number;
}

export function StatsDisplay({ displayedTime, wpm, accuracy, rawWpm, smoothProgress }: StatsDisplayProps) {
  return (
    <div className="stats-shell animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="stats-grid glass-panel">
        <div className="stat-item">
          <p className="stat-value text-shadow-glow">{displayedTime}</p>
          <p className="stat-label">seconds</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">{wpm}</p>
          <p className="stat-label">wpm</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">{accuracy}%</p>
          <p className="stat-label">accuracy</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">{rawWpm}</p>
          <p className="stat-label">raw</p>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${smoothProgress}%` }} />
      </div>
    </div>
  );
}
