"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Language, TestMode, WordState, TestStats } from "@/types";
import { createWordSet, generateWords, buildWordStates } from "@/lib/typing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeSelector } from "@/components/ModeSelector";
import { StatsDisplay } from "@/components/StatsDisplay";
import { TypingArea } from "@/components/TypingArea";
import { ResultsModal } from "@/components/ResultsModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";

const timeOptions = [15, 30, 60, 120];
const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
];

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("id");
  const [testMode, setTestMode] = useState<TestMode>("practice");
  const initialWordSet = useMemo(() => createWordSet("id"), []);

  // Game state
  const [words, setWords] = useState<string[]>(initialWordSet.words);
  const [wordStates, setWordStates] = useState<WordState[]>(() => initialWordSet.states);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // Timer state
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Stats
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);
  const testStartedAtRef = useRef<number | null>(null);

  // Initialize test
  const initializeTest = useCallback((options?: { timeOverride?: number; languageOverride?: Language; modeOverride?: TestMode }) => {
    const mode = options?.modeOverride ?? testMode;
    const duration = mode === "ranked" ? 60 : (options?.timeOverride ?? selectedTime);
    const language = options?.languageOverride ?? selectedLanguage;
    
    if (mode === "ranked" && duration !== selectedTime) setSelectedTime(60);

    const newWords = generateWords(100, language);
    setWords(newWords);
    setWordStates(buildWordStates(newWords));
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInputValue("");
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
    setSmoothProgress(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalKeystrokes(0);
    testStartedAtRef.current = null;
    
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [selectedLanguage, selectedTime, testMode]);

  // Handle Mode Change
  const handleModeChange = (newMode: TestMode) => {
    if (newMode === testMode) return;
    setTestMode(newMode);
    initializeTest({ modeOverride: newMode });
  };

  // Handle Time Change
  const handleTimeChange = (time: number) => {
    if (testMode === "ranked") return; 
    setSelectedTime(time);
    initializeTest({ timeOverride: time });
  };

  // Handle Language Change
  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    initializeTest({ languageOverride: language });
  };

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, [isFinished, isLeaderboardOpen]);

  // Auto-scroll to current word
  useEffect(() => {
    if (currentWordRef.current && wordsContainerRef.current) {
      const container = wordsContainerRef.current.querySelector('.typing-area-clean');
      if (container) {
        const wordElement = currentWordRef.current;
        const containerRect = container.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();
        const wordOffsetTop = wordRect.top - containerRect.top + container.scrollTop;
        const lineHeight = wordRect.height * 1.5;
        if (wordOffsetTop > lineHeight) {
          container.scrollTo({ top: wordOffsetTop - lineHeight, behavior: "smooth" });
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
            setSmoothProgress(100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Smooth progress animation
  useEffect(() => {
    if (!isRunning) return;
    let frameId = 0;
    const totalDurationMs = selectedTime * 1000;
    const animate = () => {
      const startedAt = testStartedAtRef.current;
      if (startedAt === null) return;
      const elapsedMs = Date.now() - startedAt;
      const nextProgress = Math.min(100, (elapsedMs / totalDurationMs) * 100);
      setSmoothProgress(nextProgress);
      if (nextProgress < 100) frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isRunning, selectedTime]);

  const calculateStats = useCallback((): TestStats => {
    const timeElapsed = selectedTime - timeLeft;
    const minutes = timeElapsed > 0 ? timeElapsed / 60 : 0;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const totalTyped = correctChars + incorrectChars;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    const rawWpm = minutes > 0 ? Math.round((totalKeystrokes / 5) / minutes) : 0;

    return { wpm, accuracy, rawWpm, time: selectedTime, mode: testMode, date: Date.now() };
  }, [correctChars, incorrectChars, totalKeystrokes, selectedTime, timeLeft, testMode]);

  const stats = calculateStats();
  const displayedTime = isRunning || isFinished ? timeLeft : selectedTime;

  // Save Ranked Score when finished
  useEffect(() => {
    if (isFinished && testMode === "ranked") {
      const saveScore = () => {
        const finalStats = calculateStats();
        if (finalStats.wpm === 0) return; 

        const savedStatsStr = localStorage.getItem("keytype_ranked_scores");
        const savedStats: TestStats[] = savedStatsStr ? JSON.parse(savedStatsStr) : [];
        savedStats.push(finalStats);
        localStorage.setItem("keytype_ranked_scores", JSON.stringify(savedStats));
      };
      saveScore();
    }
  }, [isFinished, testMode, calculateStats]);


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;
    const currentWord = words[currentWordIndex];

    if (!isRunning && !isFinished) {
      testStartedAtRef.current = Date.now();
      setIsRunning(true);
    }

    setTotalKeystrokes((prev) => prev + 1);

    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      setWordStates((prev) => {
        const newStates = [...prev];
        const wordState = { ...newStates[currentWordIndex] };

        typedWord.split("").forEach((char, idx) => {
          if (idx < currentWord.length) {
            if (char === currentWord[idx]) {
              wordState.chars[idx] = { char: currentWord[idx], state: "correct" };
              setCorrectChars((p) => p + 1);
            } else {
              wordState.chars[idx] = { char: currentWord[idx], state: "incorrect" };
              wordState.hasError = true;
              setIncorrectChars((p) => p + 1);
            }
          } else {
            wordState.chars.push({ char, state: "extra" });
            wordState.hasError = true;
            setIncorrectChars((p) => p + 1);
          }
        });

        for (let i = typedWord.length; i < currentWord.length; i++) {
          wordState.chars[i] = { char: currentWord[i], state: "incorrect" };
          wordState.hasError = true;
          setIncorrectChars((p) => p + 1);
        }

        wordState.completed = true;
        newStates[currentWordIndex] = wordState;
        setCorrectChars((p) => p + 1);
        return newStates;
      });

      setCurrentWordIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
      setInputValue("");
      
      // Expand words if running out
      if (currentWordIndex >= words.length - 10) {
        const extraWords = generateWords(50, selectedLanguage);
        setWords(prev => [...prev, ...extraWords]);
        setWordStates(prev => [...prev, ...buildWordStates(extraWords)]);
      }
      return;
    }

    setInputValue(value);
    setCurrentCharIndex(value.length);

    setWordStates((prev) => {
      const newStates = [...prev];
      const wordState = { ...newStates[currentWordIndex] };

      wordState.chars = currentWord.split("").map((char) => ({ char, state: "pending" as const }));
      wordState.hasError = false;

      value.split("").forEach((char, idx) => {
        if (idx < currentWord.length) {
          if (char === currentWord[idx]) {
            wordState.chars[idx] = { char: currentWord[idx], state: "correct" };
          } else {
            wordState.chars[idx] = { char: currentWord[idx], state: "incorrect" };
            wordState.hasError = true;
          }
        } else {
          wordState.chars.push({ char, state: "extra" });
          wordState.hasError = true;
        }
      });
      newStates[currentWordIndex] = wordState;
      return newStates;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      initializeTest();
    }
    if (e.key === "Backspace" && inputValue === "" && currentWordIndex > 0) {
      e.preventDefault();
      const prevWord = words[currentWordIndex - 1];
      setCurrentWordIndex((prev) => prev - 1);
      setInputValue(prevWord);
      setCurrentCharIndex(prevWord.length);

      setWordStates((prev) => {
        const newStates = [...prev];
        newStates[currentWordIndex - 1] = {
          chars: prevWord.split("").map((char, idx) => ({
            char,
            state: idx < prevWord.length ? "correct" as const : "pending" as const,
          })),
          completed: false,
          hasError: false,
        };
        return newStates;
      });
    }
  };

  const statusText = isFinished ? "Session complete" : isRunning ? (testMode === "ranked" ? "Ranked Test" : "Live Test") : (testMode === "ranked" ? "Ranked Mode" : "Ready");

  return (
    <main className="page-shell">
      <Header
        statusText={statusText}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      <section className="content-shell w-full max-w-5xl">
        <ModeSelector
          mode={testMode}
          onModeChange={handleModeChange}
          language={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          time={selectedTime}
          onTimeChange={handleTimeChange}
          timeOptions={timeOptions}
          languageOptions={languageOptions}
        />

        <StatsDisplay
          displayedTime={displayedTime}
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          rawWpm={stats.rawWpm}
          smoothProgress={smoothProgress}
        />

        <TypingArea
          ref={inputRef}
          inputValue={inputValue}
          onInputChange={handleInput}
          onKeyDown={handleKeyDown}
          isFinished={isFinished}
          language={selectedLanguage}
          wordStates={wordStates}
          words={words}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          wordsContainerRef={wordsContainerRef}
          currentWordRef={currentWordRef}
          onWordsClick={() => inputRef.current?.focus()}
        />
      </section>

      <Footer />

      {isFinished && (
        <ResultsModal
          stats={stats}
          wordsCount={currentWordIndex}
          onRestart={initializeTest}
        />
      )}

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => {
          setIsLeaderboardOpen(false);
          inputRef.current?.focus();
        }}
      />
    </main>
  );
}
