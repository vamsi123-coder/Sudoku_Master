// components/Numpad.jsx
import { memo } from 'react';

/**
 * Numpad — on-screen number input, erase, and reset buttons.
 * @param {{ onNumber: (n: number) => void, onErase: () => void, onReset: () => void }} props
 */
const Numpad = memo(function Numpad({ onNumber, onErase, onReset }) {
  return (
    <div className="numpad-wrap">
      <div className="numpad-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className="num-btn"
            onClick={() => onNumber(n)}
            aria-label={`Enter ${n}`}
          >
            {n}
          </button>
        ))}

        <button
          className="num-btn erase-btn"
          onClick={onErase}
          title="Erase cell"
          aria-label="Erase"
        >
          ⌫
        </button>

        <button
          className="num-btn reset-btn"
          onClick={onReset}
          title="Reset board"
          aria-label="Reset"
        >
          ↺
        </button>

        <button
          className="num-btn reset-board-btn"
          onClick={onReset}
          aria-label="Reset board"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
});

export default Numpad;
