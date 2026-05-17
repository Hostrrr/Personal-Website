import './TeSegmentClock.css'

function pad2(n) {
  return String(n).padStart(2, '0')
}

/** LCD-style clock (OP-1 / TE inspired) */
export default function TeSegmentClock({ time, showSeconds = false, className = '' }) {
  const h = pad2(time.getHours())
  const m = pad2(time.getMinutes())
  const s = pad2(time.getSeconds())

  const renderPair = (pair, key) => (
    <span className="te-seg-pair" key={key}>
      <span className="te-seg-digit">{pair[0]}</span>
      <span className="te-seg-digit">{pair[1]}</span>
    </span>
  )

  return (
    <div
      className={`te-seg-clock ${className}`.trim()}
      role="timer"
      aria-live="off"
    >
      {renderPair(h, 'h')}
      <span className="te-seg-sep">:</span>
      {renderPair(m, 'm')}
      {showSeconds && (
        <>
          <span className="te-seg-sep">:</span>
          {renderPair(s, 's')}
        </>
      )}
    </div>
  )
}
