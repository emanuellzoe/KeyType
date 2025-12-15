"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

export default function Home() {
  // Game state
  const [words, setWords] = useState<string[]>([]);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
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
  const [startTime, setStartTime] = useState<number | null>(null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);

  // Initialize words
  const initializeTest = useCallback(() => {
    const newWords = generateWords(100);
    setWords(newWords);
    setWordStates(
      newWords.map((word) => ({
        chars: word
          .split("")
          .map((char) => ({ char, state: "pending" as const })),
        completed: false,
        hasError: false,
      }))
    );
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInputValue("");
    setTimeLeft(selectedTime);
    setIsRunning(false);
    setIsFinished(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalKeystrokes(0);
    setStartTime(null);
    inputRef.current?.focus();
  }, [selectedTime]);

  // Initialize on mount and when time changes
  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

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

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;
    const currentWord = words[currentWordIndex];

    // Start timer on first input
    if (!isRunning && !isFinished) {
      setIsRunning(true);
      setStartTime(Date.now());
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
    setTimeLeft(time);
    initializeTest();
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <header className="w-full max-w-4xl mb-16 md:mb-20 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-glow">
              K
            </div>
            <h1 className="text-2xl font-bold gradient-text">KeyType</h1>
          </div>

          <nav className="flex items-center gap-2">
            <button className="btn-icon" title="Settings">
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
            <button className="btn-icon" title="Profile">
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

      {/* Main Content */}
      <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-10 md:gap-12">
        {/* Time Mode Selector */}
        <div
          className="glass-card px-4 py-3 flex items-center gap-2 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400">
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
            <span>time</span>
          </div>
          <div className="w-px h-6 bg-blue-500/20" />
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time)}
              className={`mode-btn ${selectedTime === time ? "active" : ""}`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Stats Display (During/After Test) */}
        {(isRunning || isFinished) && (
          <div className="glass-card px-10 py-6 flex items-center gap-10 md:gap-12 animate-scale-in">
            <div className="stat-item">
              <div className="stat-value text-shadow-glow">{timeLeft}</div>
              <div className="stat-label">seconds</div>
            </div>
            <div className="w-px h-12 bg-blue-500/20" />
            <div className="stat-item">
              <div className="stat-value">{stats.wpm}</div>
              <div className="stat-label">wpm</div>
            </div>
            <div className="w-px h-12 bg-blue-500/20" />
            <div className="stat-item">
              <div className="stat-value">{stats.accuracy}%</div>
              <div className="stat-label">accuracy</div>
            </div>
          </div>
        )}

        {/* Typing Area */}
        <div
          ref={wordsContainerRef}
          onClick={handleWordsClick}
          className="w-full cursor-text animate-fade-in-up relative"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute opacity-0 pointer-events-none"
            autoFocus
            disabled={isFinished}
          />

          {/* Words Display - Clean, no box */}
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
                {/* Cursor at end of word if we're past all characters */}
                {wordIdx === currentWordIndex &&
                  currentCharIndex >= words[wordIdx]?.length && (
                    <span className="char-clean current"> </span>
                  )}
              </span>
            ))}
          </div>
        </div>

        {/* Restart Hint */}
        <div
          className="flex items-center gap-3 text-sm text-gray-500 animate-fade-in-up mt-2"
          style={{ animationDelay: "0.3s" }}
        >
          <kbd className="px-2 py-1 bg-blue-500/10 rounded text-blue-400 text-xs font-mono">
            Tab
          </kbd>
          <span>to restart</span>
        </div>

        {/* Results Modal */}
        {isFinished && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
            <div className="glass-card p-10 md:p-12 max-w-lg w-full mx-4 animate-scale-in">
              <h2 className="text-3xl font-bold text-center mb-8 gradient-text">
                Test Complete!
              </h2>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-1">
                    {stats.wpm}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    WPM
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-400 mb-1">
                    {stats.accuracy}%
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-blue-300 mb-1">
                    {stats.rawWpm}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Raw WPM
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-blue-300 mb-1">
                    {currentWordIndex}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    Words
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={initializeTest}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
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
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-16 md:mt-20 pt-10 border-t border-blue-500/10">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Github
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <span className="text-blue-400">♥</span>
            <span>by KeyType</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
