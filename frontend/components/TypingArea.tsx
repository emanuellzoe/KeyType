import React, { forwardRef } from 'react';
import { WordState, Language } from "@/types";

interface TypingAreaProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isFinished: boolean;
  language: Language;
  wordStates: WordState[];
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  wordsContainerRef: React.RefObject<HTMLDivElement | null>;
  currentWordRef: React.RefObject<HTMLSpanElement | null>;
  onWordsClick: () => void;
}

export const TypingArea = forwardRef<HTMLInputElement, TypingAreaProps>(({
  inputValue, onInputChange, onKeyDown, isFinished, language,
  wordStates, words, currentWordIndex, currentCharIndex,
  wordsContainerRef, currentWordRef, onWordsClick
}, ref) => {
  return (
    <section
      ref={wordsContainerRef as any}
      onClick={onWordsClick}
      className="typing-surface glass-panel animate-fade-in-up cursor-text"
      style={{ animationDelay: "0.15s" }}
    >
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
        disabled={isFinished}
        aria-label="Typing input"
      />

      <div className="typing-header">
        <p>{language === "id" ? "Jaga akurasi, lalu dorong kecepatan." : "Keep accuracy high, then push for speed."}</p>
        <div className="restart-chip">
          <kbd>Tab</kbd>
          <span>Restart</span>
        </div>
      </div>

      <div className="typing-area-clean">
        {wordStates.map((wordState, wordIdx) => (
          <span
            key={wordIdx}
            ref={wordIdx === currentWordIndex ? (currentWordRef as any) : null}
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
    </section>
  );
});

TypingArea.displayName = "TypingArea";
