// components/SudokuBoard.jsx
import { memo } from 'react';
import { hasConflict } from '../utils/sudokuEngine';

/**
 * SudokuBoard — renders the 9×9 interactive grid.
 *
 * @param {{
 *   grid: number[][],
 *   given: number[][],
 *   solution: number[][],
 *   selected: number | null,
 *   onSelect: (idx: number) => void
 * }} props
 */
const SudokuBoard = memo(function SudokuBoard({
  grid,
  given,
  solution,
  selected,
  onSelect,
}) {
  const selRow = selected != null ? Math.floor(selected / 9) : -1;
  const selCol = selected != null ? selected % 9 : -1;
  const selVal = selected != null && grid ? grid[selRow]?.[selCol] : 0;

  return (
    <div className="board-wrap">
      <div className="sudoku-grid" role="grid" aria-label="Sudoku board">
        {grid &&
          grid.map((row, r) =>
            row.map((val, c) => {
              const idx = r * 9 + c;
              const isSelected = selected === idx;
              const isGiven = given[r][c] !== 0;
              const sameRow = r === selRow;
              const sameCol = c === selCol;
              const sameBox =
                Math.floor(r / 3) === Math.floor(selRow / 3) &&
                Math.floor(c / 3) === Math.floor(selCol / 3);
              const sameNum = selVal && val === selVal && !isSelected;
              const isHighlighted =
                !isSelected && (sameRow || sameCol || sameBox);
              const conflict = val && hasConflict(grid, r, c, val);
              const isCorrect =
                !isGiven && val && val === solution[r][c] && !conflict;
              const isIncorrect =
                !isGiven && val && val !== solution[r][c];

              // Build class string
              let cls = 'cell';
              if (isGiven) cls += ' given';
              if (isSelected) cls += ' selected';
              else if (sameNum) cls += ' same-num';
              else if (isHighlighted) cls += ' highlighted';
              if (conflict && !isGiven) cls += ' conflict';
              else if (isCorrect) cls += ' correct';
              else if (isIncorrect) cls += ' incorrect';

              return (
                <div
                  key={idx}
                  className={cls}
                  data-row={r}
                  data-col={c}
                  role="gridcell"
                  aria-label={`Row ${r + 1} Column ${c + 1}${val ? ` value ${val}` : ' empty'}`}
                  onClick={() => onSelect(idx)}
                >
                  {val ? (
                    <span key={`${val}-${idx}`} className="cell-num">
                      {val}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
      </div>
    </div>
  );
});

export default SudokuBoard;
