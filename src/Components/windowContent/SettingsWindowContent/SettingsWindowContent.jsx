import './SettingsWindowContent.css'
import { useLanguage } from '../../../hooks/useLanguage'
import { WALLPAPER_COLORS } from '../../../utils/osCommands'

const LANGUAGES = [
  { code: 'ru', label: 'RU', full: 'Русский' },
  { code: 'en', label: 'EN', full: 'English' },
]

export default function SettingsWindowContent({
  theme,
  wallpaperColor,
  onThemeToggle,
  onWallpaperChange,
  soundEnabled = true,
  onSoundToggle,
}) {
  const { language, setLanguage, t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <div className="settings-root">
      <div className="settings-section">
        <div className="settings-section-label">{t.settings.themeSection}</div>

        <button
          type="button"
          className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
          onClick={onThemeToggle}
          aria-label={t.settings.themeAriaLabel}
        >
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb">
              {isDark ? 'D' : 'L'}
            </span>
          </span>
          <span className="theme-toggle__label">
            {isDark ? t.settings.themeDark : t.settings.themeLight}
          </span>
        </button>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">{t.settings.langSection}</div>
        <div className="lang-switcher">
          {LANGUAGES.map(({ code, label, full }) => (
            <button
              key={code}
              type="button"
              className={`lang-btn ${language === code ? 'lang-btn--active' : ''}`}
              onClick={() => setLanguage(code)}
              title={full}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">{t.settings.soundSection}</div>
        <button
          type="button"
          className={`theme-toggle ${soundEnabled ? 'theme-toggle--light' : 'theme-toggle--dark'}`}
          onClick={onSoundToggle}
          aria-label={t.settings.soundAriaLabel}
        >
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb">
              {soundEnabled ? '♪' : '×'}
            </span>
          </span>
          <span className="theme-toggle__label">
            {soundEnabled ? t.settings.soundOn : t.settings.soundOff}
          </span>
        </button>
      </div>

      <div className="settings-section">
        <div className="settings-section-label">{t.settings.wallpaperSection}</div>

        <div className="wallpaper-grid">
          {WALLPAPER_COLORS.map((color, i) => {
            const label = t.settings.wallpapers[i]
            const isActive = wallpaperColor === color
            return (
              <button
                key={color}
                type="button"
                className={`wallpaper-swatch ${isActive ? 'wallpaper-swatch--active' : ''}`}
                style={{ background: color }}
                onClick={() => onWallpaperChange(color)}
                title={label}
                aria-label={label}
              >
                {isActive && <span className="wallpaper-swatch__check">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="settings-section settings-section--info">
        <div className="settings-section-label">{t.settings.infoSection}</div>
        <div className="settings-info-grid">
          <div className="settings-info-row">
            <span className="settings-info-key">{t.settings.version}</span>
            <span className="settings-info-val">YegOS 1.0</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-key">{t.settings.language}</span>
            <span className="settings-info-val">{t.settings.currentLang}</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-key">{t.settings.author}</span>
            <span className="settings-info-val">Georgiy Nazarenko</span>
          </div>
        </div>
      </div>

    </div>
  )
}
