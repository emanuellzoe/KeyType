import React, { forwardRef } from "react";
import { WordState, Language, TestMode } from "@/types";

interface TypingAreaProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isFinished: boolean;
  language: Language;
  mode: TestMode;
  wordStates: WordState[];
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  wordsContainerRef: React.RefObject<HTMLElement | null>;
  currentWordRef: React.RefObject<HTMLSpanElement | null>;
  onWordsClick: () => void;
}

export const TypingArea = forwardRef<HTMLInputElement, TypingAreaProps>(({
  inputValue, onInputChange, onKeyDown, isFinished, language, mode,
  wordStates, words, currentWordIndex, currentCharIndex,
  wordsContainerRef, currentWordRef, onWordsClick
}, ref) => {
  const headerCopy = mode === "ranked"
    ? language === "id"
      ? "Mode ranked tetap 60 detik dan hasilnya langsung masuk leaderboard lokal."
      : "Ranked stays at 60 seconds and auto-saves your score to the local leaderboard."
    : language === "id"
      ? "Jaga ritme, tekan spasi untuk mengunci kata, lalu lanjut tanpa putus fokus."
      : "Stay relaxed, hit space to lock each word, then keep the rhythm moving.";

  const helperCopy = language === "id"
    ? ["spasi menyelesaikan kata", "backspace kembali ke kata sebelumnya", "klik area ini untuk fokus"]
    : ["space submits a word", "backspace jumps to the previous word", "click here to refocus"];

  return (
    <section
      ref={wordsContainerRef}
      onClick={onWordsClick}
      className="typing-surface animate-fade-in-up cursor-text"
      style={{ animationDelay: "0.15s" }}
    >
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="typing-input-proxy"
        autoFocus
        disabled={isFinished}
        aria-label="Typing input"
      />

      <div className="typing-header">
        <p>{headerCopy}</p>
        <div className="restart-chip">
          <kbd>Tab</kbd>
          <span>restart</span>
        </div>
      </div>

      <div className="typing-area-clean">
        {wordStates.map((wordState, wordIdx) => (
          <span
            key={wordIdx}
            ref={wordIdx === currentWordIndex ? currentWordRef : undefined}
            className={`word-clean ${wordIdx < currentWordIndex ? "completed" : ""} ${wordIdx === currentWordIndex ? "active" : ""} ${wordState.hasError && wordState.completed ? "error" : ""}`}
          >
            {wordState.chars.map((charState, charIdx) => (
              <span
                key={charIdx}
                className={`char-clean ${charState.state} ${wordIdx === currentWordIndex && charIdx === currentCharIndex ? "current" : ""}`}
              >
                {charState.char}
              </span>
            ))}
            {wordIdx === currentWordIndex && currentCharIndex >= (words[wordIdx]?.length || 0) && (
              <span className="char-clean current"> </span>
            )}
          </span>
        ))}
      </div>

      <div className="typing-footer">
        {helperCopy.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
});

TypingArea.displayName = "TypingArea";
