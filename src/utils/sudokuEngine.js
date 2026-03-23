// utils/sudokuEngine.js — Puzzle generation, solving, and validation

export function generateEmptyGrid() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export function isValidPlacement(grid, row, col, num) {
  for (let c = 0; c < 9; c++) if (grid[row][c] === num) return false;
  for (let r = 0; r < 9; r++) if (grid[r][col] === num) return false;
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[br + r][bc + c] === num) return false;
  return true;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const n of nums) {
          if (isValidPlacement(grid, row, col, n)) {
            grid[row][col] = n;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(grid, limit = 2) {
  let count = 0;
  function bt(g) {
    if (count >= limit) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValidPlacement(g, row, col, n)) {
              g[row][col] = n;
              bt(g);
              g[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  bt(grid.map(r => [...r]));
  return count;
}

/**
 * Generate a valid, uniquely-solvable Sudoku puzzle.
 * @param {'easy'|'medium'|'hard'} difficulty
 * @returns {{ puzzle: number[][], solution: number[][] }}
 */
export function generatePuzzle(difficulty = 'medium') {
  const clueMap = { easy: 38, medium: 30, hard: 24 };
  const targetClues = clueMap[difficulty] ?? 30;

  const solved = generateEmptyGrid();
  solveSudoku(solved);

  const puzzle = solved.map(r => [...r]);
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));

  let removed = 0;
  const toRemove = 81 - targetClues;

  for (const idx of cells) {
    if (removed >= toRemove) break;
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSolutions(puzzle) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution: solved };
}

/**
 * Check if placing val at (row, col) creates a conflict in the current grid.
 */
export function hasConflict(grid, row, col, val) {
  if (!val) return false;
  for (let c = 0; c < 9; c++) if (c !== col && grid[row][c] === val) return true;
  for (let r = 0; r < 9; r++) if (r !== row && grid[r][col] === val) return true;
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const rr = br + r, cc = bc + c;
      if ((rr !== row || cc !== col) && grid[rr][cc] === val) return true;
    }
  return false;
}

/**
 * Returns true when every cell matches the solution.
 */
export function checkComplete(grid, solution) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] !== solution[r][c]) return false;
  return true;
}
