const ICONS = {
  about: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </>
  ),
  projects: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <path d="M4 9h16M8 5V9M16 5V9" />
    </>
  ),
  skills: (
    <>
      <path d="M6 18l3-9 3 4 3-7 3 12" />
      <circle cx="6" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <path d="M3 8l9 6 9-6" />
    </>
  ),
  settings: (
    <>
      <line x1="5" y1="8" x2="19" y2="8" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="5" y1="16" x2="19" y2="16" />
      <circle cx="9" cy="8" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="16" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  game: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  yegos: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="1" />
      <line x1="7" y1="17" x2="17" y2="17" />
      <line x1="9" y1="17" x2="9" y2="19" />
      <line x1="15" y1="17" x2="15" y2="19" />
    </>
  ),
}

export default function DockIcon({ name, size = 22, className = '' }) {
  const paths = ICONS[name] ?? ICONS.about

  return (
    <svg
      className={`dock-icon-svg ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths}
    </svg>
  )
}
