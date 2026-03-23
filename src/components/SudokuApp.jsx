// components/SudokuApp.jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import SudokuBoard from './SudokuBoard';
import StatusBar from './StatusBar';
import Numpad from './Numpad';
import WinOverlay from './WinOverlay';
import { generatePuzzle, checkComplete } from '../utils/sudokuEngine';
import { initParticles } from '../utils/particles';
import '../styles/sudoku.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function SudokuApp() {
  // ── Game state ────────────────────────────────────────
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle]         = useState(null);   // original clues (immutable)
  const [solution, setSolution]     = useState(null);   // full solved grid
  const [given, setGiven]           = useState(null);   // which cells are pre-filled
  const [grid, setGrid]             = useState(null);   // current player grid
  const [selected, setSelected]     = useState(null);   // flat index 0-80
  const [mistakes, setMistakes]     = useState(0);
  const [won, setWon]               = useState(false);

  // ── Theme ─────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem('sudoku-theme') || 'light'
  );

  // ── Particles ref ────────────────────────────────────
  const particleInstance = useRef(null);

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sudoku-theme', theme);
    particleInstance.current?.setDark(theme === 'dark');
  }, [theme]);

  // Boot particle canvas once on mount
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
      particleInstance.current = initParticles(canvas, theme === 'dark');
    }
    return () => particleInstance.current?.destroy();
    // intentionally run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Game generation ──────────────────────────────────
  const startNewGame = useCallback(
    (diff = difficulty) => {
      const { puzzle: p, solution: s } = generatePuzzle(diff);
      setPuzzle(p);
      setSolution(s);
      setGiven(p.map((r) => [...r]));   // snapshot of initial clues
      setGrid(p.map((r) => [...r]));    // mutable player grid
      setSelected(null);
      setMistakes(0);
      setWon(false);
    },
    [difficulty]
  );

  // Start a game on first render
  useEffect(() => {
    startNewGame(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Input handlers ───────────────────────────────────
  const inputNumber = useCallback(
    (num) => {
      if (selected === null || !grid || !given || !solution) return;
      const row = Math.floor(selected / 9);
      const col = selected % 9;
      if (given[row][col] !== 0) return; // given cell, ignore

      const newGrid = grid.map((r) => [...r]);
      const prev    = newGrid[row][col];
      newGrid[row][col] = num;

      // Increment mistakes only on a new wrong entry
      if (num !== solution[row][col] && prev !== num) {
        setMistakes((m) => m + 1);
      }

      setGrid(newGrid);

      if (checkComplete(newGrid, solution)) {
        setTimeout(() => setWon(true), 300);
      }
    },
    [selected, grid, given, solution]
  );

  const eraseCell = useCallback(() => {
    if (selected === null || !grid || !given) return;
    const row = Math.floor(selected / 9);
    const col = selected % 9;
    if (given[row][col] !== 0) return;
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = 0;
    setGrid(newGrid);
  }, [selected, grid, given]);

  const resetBoard = useCallback(() => {
    if (!puzzle) return;
    setGrid(puzzle.map((r) => [...r]));
    setSelected(null);
    setMistakes(0);
    setWon(false);
  }, [puzzle]);

  // ── Difficulty change ────────────────────────────────
  const handleDifficulty = useCallback(
    (d) => {
      setDifficulty(d);
      startNewGame(d);
    },
    [startNewGame]
  );

  // ── Keyboard navigation ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (selected === null || !grid || !given) return;
      const row = Math.floor(selected / 9);
      const col = selected % 9;

      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        inputNumber(parseInt(e.key, 10));
      } else if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === '0'
      ) {
        e.preventDefault();
        eraseCell();
      } else if (e.key === 'ArrowUp'    && row > 0) setSelected(selected - 9);
      else if   (e.key === 'ArrowDown'  && row < 8) setSelected(selected + 9);
      else if   (e.key === 'ArrowLeft'  && col > 0) setSelected(selected - 1);
      else if   (e.key === 'ArrowRight' && col < 8) setSelected(selected + 1);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, grid, given, inputNumber, eraseCell]);

  // ── Derived values ───────────────────────────────────
  const progress = useMemo(() => {
    if (!grid || !given) return 0;
    let filled = 0, total = 0;
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (given[r][c] === 0) { total++; if (grid[r][c] !== 0) filled++; }
    return total ? (filled / total) * 100 : 0;
  }, [grid, given]);

  const filledCount = useMemo(
    () => (grid ? grid.flat().filter((v) => v !== 0).length : 0),
    [grid]
  );

  // ── Render ───────────────────────────────────────────
  return (
    <>
      {/* Particle canvas — sits behind everything */}
      <canvas id="particles-canvas" className="particles-canvas" />

      <div className="app-wrapper">
        {/* Top-right theme toggle */}
        <div className="topbar">
          <button
            className="theme-btn"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle light/dark theme"
            title="Toggle theme"
          >
            <div className="theme-knob">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </button>
        </div>

        {/* Animated heading */}
        <div className="heading-block">
          <h1 className="heading-title">SUDOKU</h1>
          <span className="heading-glow" aria-hidden="true">SUDOKU</span>
          <p className="heading-sub">Train your mind · Fill the grid</p>
        </div>

        {/* Difficulty pills */}
        <div className="diff-row">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`diff-btn${difficulty === d ? ' active' : ''}`}
              onClick={() => handleDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <StatusBar mistakes={mistakes} progress={progress} />

        {/* Board + numpad */}
        {grid && given && solution && (
          <>
            <SudokuBoard
              grid={grid}
              given={given}
              solution={solution}
              selected={selected}
              onSelect={setSelected}
            />
            <Numpad
              onNumber={inputNumber}
              onErase={eraseCell}
              onReset={resetBoard}
            />
          </>
        )}

        {/* Win overlay */}
        {won && (
          <WinOverlay
            mistakes={mistakes}
            filled={filledCount}
            onNewGame={() => startNewGame(difficulty)}
          />
        )}
      </div>
    </>
  );
}
