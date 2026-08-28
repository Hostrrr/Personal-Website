import { useState, useEffect } from 'react'
import './HomeScreen.css'
import { useLanguage } from '../../hooks/useLanguage'
import DockIcon from '../icons/DockIcon'
import IosStatusIcons from './IosStatusIcons'
import IosHomeWidgets from './IosHomeWidgets'

const DOCK_APP_IDS = ['about', 'projects', 'contact', 'settings']

export default function HomeScreen({ apps, onOpenApp, wallpaperColor, theme, designSystem = 'te' }) {
  const { t } = useLanguage()
  const [time, setTime] = useState(new Date())
  const isApple = designSystem === 'apple'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const dateStr = time.toLocaleDateString(t.mobile.dateLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const dockApps = apps.filter(a => DOCK_APP_IDS.includes(a.id))

  return (
    <div
      className={`home-screen${isApple ? ' home-screen--apple' : ''}`}
      style={wallpaperColor && theme !== 'dark' && !isApple ? { backgroundColor: wallpaperColor } : undefined}
    >
      {isApple && <div className="home-screen__wallpaper" aria-hidden />}

      <div className="home-screen__status-bar">
        <span className="home-screen__status-time">{hours}:{minutes}</span>
        {isApple && <IosStatusIcons />}
      </div>

      {isApple ? (
        <IosHomeWidgets time={time} locale={t.mobile.dateLocale} t={t} />
      ) : (
        <div className="home-screen__widget">
          <div className="home-screen__widget-time">{hours}:{minutes}</div>
          <div className="home-screen__widget-date">{dateStr}</div>
          <div className="home-screen__widget-greeting">{t.mobile.greeting}</div>
        </div>
      )}

      <div className="home-screen__grid">
        {apps.map(app => (
          <button
            key={app.id}
            type="button"
            className="app-icon"
            onClick={() => onOpenApp(app.id)}
            style={{ '--app-accent': app.accent }}
          >
            <div className="app-icon__face">
              <DockIcon name={app.id} size={isApple ? 60 : 44} designSystem={designSystem} />
            </div>
            <span className="app-icon__label">{app.title}</span>
          </button>
        ))}
      </div>

      <div className="home-screen__dock-wrap">
        <div className={`home-screen__dock${isApple ? ' apple-glass' : ''}`}>
          {dockApps.map(app => (
            <button
              key={app.id}
              type="button"
              className="mobile-dock-icon"
              onClick={() => onOpenApp(app.id)}
              style={{ '--app-accent': app.accent }}
            >
              <div className="mobile-dock-icon__face">
                <DockIcon name={app.id} size={isApple ? 58 : 36} designSystem={designSystem} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
