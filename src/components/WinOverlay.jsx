// components/WinOverlay.jsx
import { memo, useEffect } from 'react';

/** Spawn CSS confetti pieces into the document body. */
function spawnConfetti() {
  const colors = [
    '#8b7cf8',
    '#a99ffc',
    '#c084fc',
    '#f472b6',
    '#34d399',
    '#fbbf24',
  ];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = 5 + Math.random() * 8;
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: 0;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.2 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.6}s;
    `;
    document.body.appendChild(el);
    // Clean up after animation finishes
    setTimeout(() => el.remove(), 3200);
  }
}

/**
 * WinOverlay — full-screen celebration shown when puzzle is solved.
 *
 * @param {{
 *   mistakes: number,
 *   filled: number,
 *   onNewGame: () => void
 * }} props
 */
const WinOverlay = memo(function WinOverlay({ mistakes, filled, onNewGame }) {
  useEffect(() => {
    spawnConfetti();
  }, []);

  /** Close overlay when clicking the backdrop */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onNewGame();
  };

  return (
    <div
      className="win-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Puzzle complete"
      onClick={handleBackdropClick}
    >
      <div className="win-card">
        <span className="win-emoji" role="img" aria-label="Party popper">
          🎉
        </span>

        <div className="win-title">Puzzle Solved!</div>
        <div className="win-sub">Excellent work — the grid is complete.</div>

        <div className="win-stats">
          <div className="win-stat">
            <span className="win-stat-val">{filled}</span>
            <span className="win-stat-label">Cells</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-val">{mistakes}</span>
            <span className="win-stat-label">Mistakes</span>
          </div>
        </div>

        <button className="win-new-btn" onClick={onNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
});

export default WinOverlay;
