"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// Word lists for typing test
const wordLists = {
  common: [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "I",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "we",
    "say",
    "her",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "what",
    "so",
    "up",
    "out",
    "if",
    "about",
    "who",
    "get",
    "which",
    "go",
    "me",
    "when",
    "make",
    "can",
    "like",
    "time",
    "no",
    "just",
    "him",
    "know",
    "take",
    "people",
    "into",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "see",
    "other",
    "than",
    "then",
    "now",
    "look",
    "only",
    "come",
    "its",
    "over",
    "think",
    "also",
    "back",
    "after",
    "use",
    "two",
    "how",
    "our",
    "work",
    "first",
    "well",
    "way",
    "even",
    "new",
    "want",
    "because",
    "any",
    "these",
    "give",
    "day",
    "most",
    "us",
    "world",
    "very",
    "through",
    "feel",
    "before",
    "high",
    "right",
    "still",
    "find",
    "here",
    "thing",
    "where",
    "much",
    "should",
    "ask",
    "big",
    "while",
    "home",
    "such",
    "put",
    "why",
    "against",
    "old",
    "run",
    "follow",
    "show",
    "never",
    "thought",
    "always",
    "mean",
    "each",
    "need",
    "away",
    "different",
    "down",
    "write",
    "long",
    "life",
    "move",
    "change",
    "help",
    "must",
    "call",
    "might",
    "become",
    "start",
    "keep",
    "let",
    "begin",
    "seem",
    "child",
    "country",
    "point",
    "group",
    "problem",
    "open",
    "school",
    "every",
    "leave",
    "city",
  ],
};

// Generate random words for typing
function generateWords(count: number): string[] {
  const words: string[] = [];
  const wordPool = wordLists.common;
  for (let i = 0; i < count; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }
  return words;
}

// Time options
const timeOptions = [15, 30, 60, 120];

interface CharState {
  char: string;
  state: "pending" | "correct" | "incorrect" | "extra";
}

interface WordState {
  chars: CharState[];
  completed: boolean;
  hasError: boolean;
}

function buildWordStates(sourceWords: string[]): WordState[] {
  return sourceWords.map((word) => ({
    chars: word.split("").map((char) => ({ char, state: "pending" as const })),
    completed: false,
    hasError: false,
  }));
}

export default function Home() {
  const initialWords = useMemo(() => generateWords(100), []);

  // Game state
  const [words, setWords] = useState<string[]>(initialWords);
  const [wordStates, setWordStates] = useState<WordState[]>(() =>
    buildWordStates(initialWords)
  );
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // Timer state
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);

  // Initialize words
  const initializeTest = useCallback((timeOverride?: number) => {
    const duration = timeOverride ?? selectedTime;
    const newWords = generateWords(100);
    setWords(newWords);
    setWordStates(buildWordStates(newWords));
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInputValue("");
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalKeystrokes(0);
    inputRef.current?.focus();
  }, [selectedTime]);

  // Keep input focused for immediate typing
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to current word
  useEffect(() => {
    if (currentWordRef.current && wordsContainerRef.current) {
      const container =
        wordsContainerRef.current.querySelector(".typing-area-clean");
      if (container) {
        const wordElement = currentWordRef.current;
        const containerRect = container.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();

        // Calculate relative position
        const wordOffsetTop =
          wordRect.top - containerRect.top + container.scrollTop;
        const lineHeight = wordRect.height * 1.5;

        // Scroll if word is below the first line
        if (wordOffsetTop > lineHeight) {
          container.scrollTo({
            top: wordOffsetTop - lineHeight,
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentWordIndex]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Calculate WPM and accuracy
  const calculateStats = useCallback(() => {
    const timeElapsed = selectedTime - timeLeft;
    const minutes = timeElapsed / 60;

    // WPM calculation (standard: 5 chars = 1 word)
    const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;

    // Accuracy calculation
    const totalTyped = correctChars + incorrectChars;
    const accuracy =
      totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    // Raw WPM (including errors)
    const rawWpm = minutes > 0 ? Math.round(totalKeystrokes / 5 / minutes) : 0;

    return { wpm, accuracy, rawWpm };
  }, [correctChars, incorrectChars, totalKeystrokes, selectedTime, timeLeft]);

  const stats = calculateStats();
  const progressPercentage = Math.min(
    100,
    Math.max(0, ((selectedTime - timeLeft) / selectedTime) * 100)
  );
  const displayedTime = isRunning || isFinished ? timeLeft : selectedTime;

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    const currentWord = words[currentWordIndex];

    // Start timer on first input
    if (!isRunning && !isFinished) {
      setIsRunning(true);
    }

    setTotalKeystrokes((prev) => prev + 1);

    // Check for space - move to next word
    if (value.endsWith(" ")) {
      const typedWord = value.trim();

      // Update word state
      setWordStates((prev) => {
        const newStates = [...prev];
        const wordState = { ...newStates[currentWordIndex] };

        // Check each character
        typedWord.split("").forEach((char, idx) => {
          if (idx < currentWord.length) {
            if (char === currentWord[idx]) {
              wordState.chars[idx] = {
                char: currentWord[idx],
                state: "correct",
              };
              setCorrectChars((p) => p + 1);
            } else {
              wordState.chars[idx] = {
                char: currentWord[idx],
                state: "incorrect",
              };
              wordState.hasError = true;
              setIncorrectChars((p) => p + 1);
            }
          } else {
            // Extra characters
            wordState.chars.push({ char, state: "extra" });
            wordState.hasError = true;
            setIncorrectChars((p) => p + 1);
          }
        });

        // Mark remaining chars as incorrect if word is incomplete
        for (let i = typedWord.length; i < currentWord.length; i++) {
          wordState.chars[i] = { char: currentWord[i], state: "incorrect" };
          wordState.hasError = true;
          setIncorrectChars((p) => p + 1);
        }

        wordState.completed = true;
        newStates[currentWordIndex] = wordState;

        // Count space as correct char
        setCorrectChars((p) => p + 1);

        return newStates;
      });

      // Move to next word
      setCurrentWordIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
      setInputValue("");
      return;
    }

    // Update current character states
    setInputValue(value);
    setCurrentCharIndex(value.length);

    // Live character feedback
    setWordStates((prev) => {
      const newStates = [...prev];
      const wordState = { ...newStates[currentWordIndex] };

      // Reset chars to original state
      wordState.chars = currentWord.split("").map((char) => ({
        char,
        state: "pending" as const,
      }));
      wordState.hasError = false;

      // Update based on current input
      value.split("").forEach((char, idx) => {
        if (idx < currentWord.length) {
          if (char === currentWord[idx]) {
            wordState.chars[idx] = { char: currentWord[idx], state: "correct" };
          } else {
            wordState.chars[idx] = {
              char: currentWord[idx],
              state: "incorrect",
            };
            wordState.hasError = true;
          }
        } else {
          // Extra characters typed
          wordState.chars.push({ char, state: "extra" });
          wordState.hasError = true;
        }
      });

      newStates[currentWordIndex] = wordState;
      return newStates;
    });
  };

  // Handle key down for special keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      initializeTest();
    }

    // Backspace handling for word boundary
    if (e.key === "Backspace" && inputValue === "" && currentWordIndex > 0) {
      e.preventDefault();
      // Go back to previous word
      const prevWord = words[currentWordIndex - 1];
      setCurrentWordIndex((prev) => prev - 1);
      setInputValue(prevWord);
      setCurrentCharIndex(prevWord.length);

      // Reset previous word state
      setWordStates((prev) => {
        const newStates = [...prev];
        newStates[currentWordIndex - 1] = {
          chars: prevWord.split("").map((char, idx) => ({
            char,
            state:
              idx < prevWord.length
                ? ("correct" as const)
                : ("pending" as const),
          })),
          completed: false,
          hasError: false,
        };
        return newStates;
      });
    }
  };

  // Focus input when clicking on words area
  const handleWordsClick = () => {
    inputRef.current?.focus();
  };

  // Change time mode
  const handleTimeChange = (time: number) => {
    setSelectedTime(time);
    initializeTest(time);
  };

  return (
    <main className="page-shell">
      <header className="w-full max-w-5xl animate-fade-in-up">
        <div className="top-nav glass-panel">
          <div className="brand-cluster">
            <div className="brand-mark">K</div>
            <div>
              <h1 className="brand-title">KeyType</h1>
              <p className="brand-subtitle">Speed, rhythm, precision.</p>
            </div>
          </div>

          <nav className="nav-actions">
            <span className="status-pill">
              {isFinished ? "Session complete" : isRunning ? "Live test" : "Ready"}
            </span>
            <button className="btn-icon" title="Settings" aria-label="Settings">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button className="btn-icon" title="Profile" aria-label="Profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <section className="content-shell w-full max-w-5xl">
        <div
          className="mode-strip glass-panel animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="mode-label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Duration</span>
          </div>
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time)}
              className={`mode-btn ${selectedTime === time ? "active" : ""}`}
            >
              {time}s
            </button>
          ))}
        </div>

        <div
          className="stats-shell animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="stats-grid glass-panel">
            <div className="stat-item">
              <p className="stat-value text-shadow-glow">{displayedTime}</p>
              <p className="stat-label">seconds</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{stats.wpm}</p>
              <p className="stat-label">wpm</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{stats.accuracy}%</p>
              <p className="stat-label">accuracy</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{stats.rawWpm}</p>
              <p className="stat-label">raw</p>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <section
          ref={wordsContainerRef}
          onClick={handleWordsClick}
          className="typing-surface glass-panel animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 pointer-events-none"
            autoFocus
            disabled={isFinished}
            aria-label="Typing input"
          />

          <div className="typing-header">
            <p>Keep accuracy high, then push for speed.</p>
            <div className="restart-chip">
              <kbd>Tab</kbd>
              <span>Restart</span>
            </div>
          </div>

          <div className="typing-area-clean">
            {wordStates.map((wordState, wordIdx) => (
              <span
                key={wordIdx}
                ref={wordIdx === currentWordIndex ? currentWordRef : null}
                className={`word-clean ${
                  wordIdx < currentWordIndex ? "completed" : ""
                } ${wordIdx === currentWordIndex ? "active" : ""} ${
                  wordState.hasError && wordState.completed ? "error" : ""
                }`}
              >
                {wordState.chars.map((charState, charIdx) => (
                  <span
                    key={charIdx}
                    className={`char-clean ${charState.state} ${
                      wordIdx === currentWordIndex &&
                      charIdx === currentCharIndex
                        ? "current"
                        : ""
                    }`}
                  >
                    {charState.char}
                  </span>
                ))}
                {wordIdx === currentWordIndex &&
                  currentCharIndex >= words[wordIdx]?.length && (
                    <span className="char-clean current"> </span>
                  )}
              </span>
            ))}
          </div>
        </section>
      </section>

      <footer className="footer-shell w-full max-w-5xl animate-fade-in-up">
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">GitHub</a>
        </div>
        <p>Built with care by KeyType</p>
      </footer>

      {isFinished && (
        <div className="results-overlay animate-fade-in-up">
          <div className="results-card glass-panel animate-scale-in">
            <h2 className="results-title">Test Complete</h2>

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
                <p className="results-value">{currentWordIndex}</p>
                <p className="results-label">Words</p>
              </div>
            </div>

            <button
              onClick={() => initializeTest()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

