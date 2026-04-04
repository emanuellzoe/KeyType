interface StatsDisplayProps {
  displayedTime: number;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  smoothProgress: number;
}

export function StatsDisplay({ displayedTime, wpm, accuracy, rawWpm, smoothProgress }: StatsDisplayProps) {
  const items = [
    { label: "time", value: displayedTime, emphasis: true },
    { label: "wpm", value: wpm, emphasis: true },
    { label: "accuracy", value: `${accuracy}%`, emphasis: false },
    { label: "raw", value: rawWpm, emphasis: false },
  ];

  return (
    <div className="stats-shell animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="stats-grid">
        {items.map((item) => (
          <div key={item.label} className={`stat-item ${item.emphasis ? "priority" : ""}`}>
            <p className="stat-label">{item.label}</p>
            <p className={`stat-value ${item.emphasis ? "priority" : ""}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${smoothProgress}%` }} />
      </div>
    </div>
  );
}
