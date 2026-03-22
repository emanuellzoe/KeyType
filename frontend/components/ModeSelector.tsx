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
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="mode-strip glass-panel animate-fade-in-up" style={{ animationDelay: "0.02s" }}>
        <div className="mode-label">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           <span>Mode</span>
        </div>
        <button onClick={() => onModeChange("practice")} className={`mode-btn ${mode === "practice" ? "active" : ""}`}>Practice</button>
        <button onClick={() => onModeChange("ranked")} className={`mode-btn ${mode === "ranked" ? "active" : ""}`}>Ranked</button>
      </div>

      <div className="flex gap-4 items-center justify-center flex-wrap w-full">
        <div className="mode-strip glass-panel animate-fade-in-up flex-1" style={{ animationDelay: "0.05s" }}>
          <div className="mode-label">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Duration</span>
          </div>
          {timeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onTimeChange(opt)}
              disabled={mode === "ranked"}
              className={`mode-btn ${time === opt ? "active" : ""} ${mode === "ranked" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {opt}s
            </button>
          ))}
        </div>

        <div className="mode-strip glass-panel animate-fade-in-up flex-1" style={{ animationDelay: "0.08s" }}>
          <div className="mode-label">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1 13h4m-2-2v2m5-12h4m-2-2v2m-7 4l4 4m0-4l-4 4" />
            </svg>
            <span>Language</span>
          </div>
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
    </div>
  );
}
