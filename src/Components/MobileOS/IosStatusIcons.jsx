export default function IosStatusIcons() {
  return (
    <span className="ios-status-icons" aria-hidden>
      <svg className="ios-status-icons__cell" viewBox="0 0 18 12" width="18" height="12">
        <rect x="0" y="8" width="3" height="4" rx="0.6" fill="currentColor" />
        <rect x="5" y="5" width="3" height="7" rx="0.6" fill="currentColor" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.6" fill="currentColor" />
        <rect x="15" y="0" width="3" height="12" rx="0.6" fill="currentColor" opacity="0.35" />
      </svg>
      <svg className="ios-status-icons__wifi" viewBox="0 0 16 12" width="16" height="12">
        <path d="M8 10.4a1.15 1.15 0 1 0 0-2.3 1.15 1.15 0 0 0 0 2.3Z" fill="currentColor" />
        <path d="M4.4 7.2a5.1 5.1 0 0 1 7.2 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M2.1 4.8a8.4 8.4 0 0 1 11.8 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="ios-status-icons__battery">
        <svg viewBox="0 0 27 13" width="27" height="13">
          <rect x="0.7" y="0.7" width="22" height="11.6" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="2.2" y="2.3" width="16.5" height="8.4" rx="1.4" fill="currentColor" />
          <path d="M24.2 4.2h1.1c.8 0 1.4.6 1.4 1.4v1.8c0 .8-.6 1.4-1.4 1.4h-1.1" fill="currentColor" />
        </svg>
      </span>
    </span>
  )
}
