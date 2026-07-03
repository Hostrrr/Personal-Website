import aboutIcon from '../../assets/Icons/AboutMe.svg'
import projectsIcon from '../../assets/Icons/Portfolio.svg'
import skillsIcon from '../../assets/Icons/Skills.svg'
import contactIcon from '../../assets/Icons/Contacts.svg'
import settingsIcon from '../../assets/Icons/Settings.svg'
import gameIcon from '../../assets/Icons/Snake.svg'

const ICONS = {
  about: aboutIcon,
  projects: projectsIcon,
  skills: skillsIcon,
  contact: contactIcon,
  settings: settingsIcon,
  game: gameIcon,
}

const YEGOS_PATHS = (
  <>
    <rect x="3" y="5" width="18" height="12" rx="1" />
    <line x1="7" y1="17" x2="17" y2="17" />
    <line x1="9" y1="17" x2="9" y2="19" />
    <line x1="15" y1="17" x2="15" y2="19" />
  </>
)

const TERMINAL_PATHS = (
  <>
    <rect x="3" y="4" width="18" height="14" rx="1.5" />
    <polyline points="7 9 10 12 7 15" />
    <line x1="12" y1="15" x2="17" y2="15" />
  </>
)

export default function DockIcon({ name, size = 22, className = '' }) {
  const src = ICONS[name]

  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={`dock-icon-img ${className}`.trim()}
        draggable={false}
        aria-hidden
      />
    )
  }

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
      {name === 'yegos' ? YEGOS_PATHS : name === 'terminal' ? TERMINAL_PATHS : (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
        </>
      )}
    </svg>
  )
}
