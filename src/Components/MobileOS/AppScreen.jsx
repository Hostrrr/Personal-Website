import WindowContent from '../WindowContent'
import './AppScreen.css'
import { useLanguage } from '../../contexts/LanguageContext'

export default function AppScreen({ isOpen, app, theme, onThemeToggle, wallpaperColor, onWallpaperChange, onClose }) {
  const { t } = useLanguage()
  if (!app) return null

  return (
    <div className={`app-screen${isOpen ? ' app-screen--open' : ''}`}>
      <div
        className="app-screen__header"
        style={{ background: app.color }}
      >
        <button className="app-screen__back-btn" onClick={onClose} aria-label={t.mobile.backAriaLabel}>
          ←
        </button>
        <div className="app-screen__header-title">
          <span className="app-screen__header-icon">{app.icon}</span>
          <span>{app.title}</span>
        </div>
        <div className="app-screen__header-spacer" />
      </div>

      <div className="app-screen__content">
        <WindowContent
          type={app.id}
          theme={theme}
          onThemeToggle={onThemeToggle}
          wallpaperColor={wallpaperColor}
          onWallpaperChange={onWallpaperChange}
        />
      </div>

      <button className="app-screen__home-indicator" onClick={onClose} aria-label={t.mobile.homeAriaLabel}>
        <div className="app-screen__home-bar" />
      </button>
    </div>
  )
}
