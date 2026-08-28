import aboutIcon from '../../assets/Icons/AboutMe.svg'
import projectsIcon from '../../assets/Icons/Portfolio.svg'
import skillsIcon from '../../assets/Icons/Skills.svg'
import contactIcon from '../../assets/Icons/Contacts.svg'
import settingsIcon from '../../assets/Icons/Settings.svg'
import gameIcon from '../../assets/Icons/Snake.svg'
import paintIcon from '../../assets/Icons/Paint.svg'
import resumeIcon from '../../assets/Icons/Resume.svg'

import aboutApple from '../../assets/Icons/apple/about.png'
import projectsApple from '../../assets/Icons/apple/projects.png'
import skillsApple from '../../assets/Icons/apple/skills.png'
import contactApple from '../../assets/Icons/apple/contact.png'
import settingsApple from '../../assets/Icons/apple/settings.png'
import gameApple from '../../assets/Icons/apple/game.png'
import paintApple from '../../assets/Icons/apple/paint.png'
import resumeApple from '../../assets/Icons/apple/resume.png'

const ICONS = {
  about: aboutIcon,
  projects: projectsIcon,
  skills: skillsIcon,
  contact: contactIcon,
  settings: settingsIcon,
  game: gameIcon,
  paint: paintIcon,
  resume: resumeIcon,
}

const APPLE_ICONS = {
  about: aboutApple,
  projects: projectsApple,
  skills: skillsApple,
  contact: contactApple,
  settings: settingsApple,
  game: gameApple,
  paint: paintApple,
  resume: resumeApple,
}

const YEGOS_PATHS = (
  <>
    <rect x="3" y="5" width="18" height="12" rx="1" />
    <line x1="7" y1="17" x2="17" y2="17" />
    <line x1="9" y1="17" x2="9" y2="19" />
    <line x1="15" y1="17" x2="15" y2="19" />
  </>
)

export default function DockIcon({ name, size = 22, className = '', designSystem = 'te' }) {
  const iconSet = designSystem === 'apple' ? APPLE_ICONS : ICONS
  const src = iconSet[name]

  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={`dock-icon-img ${designSystem === 'apple' ? 'dock-icon-img--apple' : ''} ${className}`.trim()}
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
      {name === 'yegos' ? YEGOS_PATHS : (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
        </>
      )}
    </svg>
  )
}
