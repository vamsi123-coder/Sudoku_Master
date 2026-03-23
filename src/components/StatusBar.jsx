// components/StatusBar.jsx
import { memo } from 'react';

/**
 * StatusBar — shows mistake count and fill progress.
 * @param {{ mistakes: number, progress: number }} props
 */
const StatusBar = memo(function StatusBar({ mistakes, progress }) {
  return (
    <div className="status-bar">
      <div className="stat-item">
        <span className={`stat-val${mistakes > 0 ? ' red' : ''}`}>
          {mistakes}
        </span>
        <span className="stat-label">Mistakes</span>
      </div>

      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="stat-item">
        <span className="stat-val">{Math.round(progress)}%</span>
        <span className="stat-label">Progress</span>
      </div>
    </div>
  );
});

export default StatusBar;
