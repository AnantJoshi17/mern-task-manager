// components/ProgressStrip.jsx
// One segment per task, filled in as tasks get completed.
// It receives numbers already calculated in App — it does no logic of its own.

function ProgressStrip({ total, done }) {
  if (total === 0) {
    return (
      <div className="progress">
        <div className="progress-strip">
          <span className="segment segment-empty" />
        </div>
        <p className="progress-label">Nothing tracked yet</p>
      </div>
    );
  }

  const percent = Math.round((done / total) * 100);

  // Array.from builds an array of the right length so we can map over it.
  const segments = Array.from({ length: total }, (_, index) => index < done);

  return (
    <div className="progress">
      <div className="progress-strip">
        {segments.map((isDone, index) => (
          <span key={index} className={`segment ${isDone ? 'segment-done' : ''}`} />
        ))}
      </div>
      <p className="progress-label">
        <strong>{done}</strong> of <strong>{total}</strong> done
        <span className="progress-percent">{percent}%</span>
      </p>
    </div>
  );
}

export default ProgressStrip;
