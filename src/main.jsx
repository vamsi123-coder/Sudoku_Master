// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SudokuApp from './components/SudokuApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SudokuApp />
  </StrictMode>
);
