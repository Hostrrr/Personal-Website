import './SettingsWindowContent.css'
import { useLanguage } from '../../../contexts/LanguageContext'

const WALLPAPER_COLORS = [
  '#cdab2f',
  '#3da6c9',
  '#b05050',
  '#44b744',
  '#c37fd2',
  '#4e4ecb',
  '#f0f0f0',
  '#1a1a2e',
]

const LANGUAGES = [
  { code: 'ru', label: 'RU', full: 'Русский' },
  { code: 'en', label: 'EN', full: 'English' },
]

export default function SettingsWindowContent({
  theme,
  wallpaperColor,
  onThemeToggle,
  onWallpaperChange,
}) {
  const { language, setLanguage, t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <div className="settings-root">

      {/* ── Тема ─────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-label">{t.settings.themeSection}</div>

        <button
          className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
          onClick={onThemeToggle}
          aria-label={t.settings.themeAriaLabel}
        >
          <span className="theme-toggle__track">
            <span className="theme-toggle__thumb">
              {isDark ? '🌙' : '☀️'}
            </span>
          </span>
          <span className="theme-toggle__label">
            {isDark ? t.settings.themeDark : t.settings.themeLight}
          </span>
        </button>
      </div>

      {/* ── Язык ─────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-label">{t.settings.langSection}</div>
        <div className="lang-switcher">
          {LANGUAGES.map(({ code, label, full }) => (
            <button
              key={code}
              className={`lang-btn ${language === code ? 'lang-btn--active' : ''}`}
              onClick={() => setLanguage(code)}
              title={full}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Обои ─────────────────────────────────────── */}
      <div className="settings-section">
        <div className="settings-section-label">{t.settings.wallpaperSection}</div>

        <div className="wallpaper-grid">
          {WALLPAPER_COLORS.map((color, i) => {
            const label = t.settings.wallpapers[i]
            const isActive = wallpaperColor === color
            return (
              <button
                key={color}
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

      {/* ── Инфо ─────────────────────────────────────── */}
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
