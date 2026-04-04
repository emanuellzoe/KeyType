import { Language, TestMode } from "@/types";

interface ModeSelectorProps {
  mode: TestMode;
  onModeChange: (m: TestMode) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  time: number;
  onTimeChange: (t: number) => void;
  timeOptions: number[];
  languageOptions: { label: string; value: Language }[];
}

export function ModeSelector({
  mode, onModeChange,
  language, onLanguageChange,
  time, onTimeChange,
  timeOptions, languageOptions
}: ModeSelectorProps) {
  return (
    <section className="control-dock animate-fade-in-up" style={{ animationDelay: "0.02s" }}>
      <div className="control-group">
        <span className="control-label">mode</span>
        <div className="control-buttons">
          <button onClick={() => onModeChange("practice")} className={`mode-btn ${mode === "practice" ? "active" : ""}`}>practice</button>
          <button onClick={() => onModeChange("ranked")} className={`mode-btn ${mode === "ranked" ? "active" : ""}`}>ranked</button>
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">time</span>
        <div className="control-buttons">
          {timeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onTimeChange(opt)}
              disabled={mode === "ranked"}
              className={`mode-btn ${time === opt ? "active" : ""} ${mode === "ranked" ? "is-disabled" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">language</span>
        <div className="control-buttons">
          {languageOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onLanguageChange(opt.value)}
              className={`mode-btn ${language === opt.value ? "active" : ""}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <p className="dock-note">
        {mode === "ranked"
          ? "Ranked keeps the old fixed 60-second challenge and still saves every finished run to your local leaderboard."
          : "Practice still supports your old language and duration controls, now arranged like a cleaner command bar."}
      </p>
    </section>
  );
}
