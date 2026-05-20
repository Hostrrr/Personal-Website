import WindowContent from '../WindowContent'
import './AppScreen.css'
import { useLanguage } from '../../contexts/LanguageContext'
import DockIcon from '../icons/DockIcon'
import { playUiOpen } from '../../utils/uiSound'

export default function AppScreen({ isOpen, app, theme, onThemeToggle, wallpaperColor, onWallpaperChange, onClose }) {
  const { t } = useLanguage()
  if (!app) return null

  const handleClose = () => {
    playUiOpen()
    onClose()
  }

  return (
    <div className={`app-screen${isOpen ? ' app-screen--open' : ''}`}>
      <div className="app-screen__header">
        <button className="app-screen__back-btn" onClick={handleClose} aria-label={t.mobile.backAriaLabel}>
          ←
        </button>
        <div className="app-screen__header-title">
          <span className="app-screen__header-icon">
            <DockIcon name={app.id} size={28} />
          </span>
          {app.moduleId && <span className="app-screen__header-code">{app.moduleId}</span>}
          <span className="app-screen__header-name">{app.title}</span>
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

      <button className="app-screen__home-indicator" onClick={handleClose} aria-label={t.mobile.homeAriaLabel}>
        <div className="app-screen__home-bar" />
      </button>
    </div>
  )
}
