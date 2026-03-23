# 🧩 Sudoku Master

A modern, responsive Sudoku web application built with React.js that offers an interactive and clean puzzle-solving experience with real-time validation and smooth UI.

---

## 🚀 Features

- 🎮 Interactive 9x9 Sudoku grid
- 🎚️ Multiple difficulty levels: Easy, Medium, Hard
- 🌗 Light & Dark mode toggle (with persistence)
- ✅ Real-time validation
  - Correct entries → Green
  - Wrong entries → Red
- 📊 Live progress tracking and mistake counter
- 🏆 Win overlay on completion
- 🔢 On-screen numpad for easy input
- 📱 Fully responsive (mobile, tablet, desktop)
- ✨ Smooth animations and modern UI

---

## 🛠️ Tech Stack

- React.js (Functional Components + Hooks)
- CSS (Custom styling with responsive design)
- JavaScript (Sudoku generation + solving logic)

---

## 📂 Project Structure
Sudoku_Master/
│
├── components/
│   ├── Numpad.jsx
│   ├── StatusBar.jsx
│   ├── SudokuApp.jsx
│   ├── SudokuBoard.jsx
│   └── WinOverlay.jsx
│
├── style/
│   └── sudoku.css
│
├── utils/
│   ├── particles.js
│   └── sudokuEngine.js
│
├── package.json
└── README.md


---

## ⚙️ How It Works

- The Sudoku board is dynamically generated based on selected difficulty.
- A backtracking algorithm ensures each puzzle is valid and solvable.
- Inputs are validated in real-time across rows, columns, and 3x3 grids.
- UI updates instantly to reflect correctness and progress.

---

## 🧠 Future Improvements

- ⏱️ Timer feature
- 📝 Notes (pencil mode)
- 🔄 Undo/Redo functionality
- 🔊 Sound effects
- 🌐 Backend for saving game state

---

## 📦 Installation

```bash
git clone https://github.com/vamsi123-coder/Sudoku_Master.git
cd Sudoku_Master
npm install
npm start
