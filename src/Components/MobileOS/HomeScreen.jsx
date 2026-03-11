import { useState, useEffect } from 'react'
import './HomeScreen.css'
import { useLanguage } from '../../contexts/LanguageContext'

const DOCK_APP_IDS = ['about', 'projects', 'skills', 'contact']

export default function HomeScreen({ apps, onOpenApp, wallpaperColor, theme }) {
  const { t } = useLanguage()
  const [time, setTime] = useState(new Date())

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
      className="home-screen"
      style={wallpaperColor && theme !== 'dark' ? { backgroundColor: wallpaperColor } : undefined}
    >
      {/* Status bar */}
      <div className="home-screen__status-bar">
        <span className="home-screen__status-time">{hours}:{minutes}</span>
        <div className="home-screen__status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Date / greeting widget */}
      <div className="home-screen__widget">
        <div className="home-screen__widget-time">{hours}:{minutes}</div>
        <div className="home-screen__widget-date">{dateStr}</div>
        <div className="home-screen__widget-greeting">{t.mobile.greeting}</div>
      </div>

      {/* App icon grid */}
      <div className="home-screen__grid">
        {apps.map(app => (
          <button
            key={app.id}
            className="app-icon"
            onClick={() => onOpenApp(app.id)}
            style={{ '--app-color': app.color }}
          >
            <div className="app-icon__face">
              <span className="app-icon__emoji">{app.icon}</span>
            </div>
            <span className="app-icon__label">{app.title}</span>
          </button>
        ))}
      </div>

      {/* Dock */}
      <div className="home-screen__dock-wrap">
        <div className="home-screen__dock">
          {dockApps.map(app => (
            <button
              key={app.id}
              className="mobile-dock-icon"
              onClick={() => onOpenApp(app.id)}
              style={{ '--app-color': app.color }}
            >
              <div className="mobile-dock-icon__face">
                <span>{app.icon}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
