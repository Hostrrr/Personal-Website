import './TaskBar.css'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { darkenAndSaturate } from '../utils/colorUtils'
import { getModule } from '../config/osModules'

export default function TaskBar({ windows, activeWindowId, theme, onThemeToggle, onWindowClick, onOpenWindow }) {
  const { t, language } = useLanguage()
  const openWindows = windows.filter(w => w.isOpen)

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [clockMode, setClockMode] = useState('plain')
  const [time, setTime] = useState(new Date())
  const menuRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        startRef.current &&
        !startRef.current.contains(e.target)
      ) {
        setIsStartOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getThemedItemColor = (color) => {
    if (!color) return color
    return theme === 'dark' ? darkenAndSaturate(color, 0.45) : color
  }

  const renderAnalogClock = () => {
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    const hourDegrees = (hours * 30) + (minutes * 0.5)
    const minuteDegrees = (minutes * 6) + (seconds * 0.1)
    const secondDegrees = seconds * 6
    const stroke = theme === 'dark' ? '#f4f3ef' : '#1a1a18'

    return (
      <svg width="36" height="36" viewBox="0 0 40 40" className="taskbar-analog-clock">
        <circle cx="20" cy="20" r="18" fill="none" stroke={stroke} strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
          const angle = (i * 30) * (Math.PI / 180)
          const x1 = 20 + 16 * Math.sin(angle)
          const y1 = 20 - 16 * Math.cos(angle)
          const x2 = 20 + 14 * Math.sin(angle)
          const y2 = 20 - 14 * Math.cos(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1" />
        })}
        <line x1="20" y1="20" x2={20 + 8 * Math.sin(hourDegrees * Math.PI / 180)} y2={20 - 8 * Math.cos(hourDegrees * Math.PI / 180)} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="20" x2={20 + 12 * Math.sin(minuteDegrees * Math.PI / 180)} y2={20 - 12 * Math.cos(minuteDegrees * Math.PI / 180)} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="20" x2={20 + 13 * Math.sin(secondDegrees * Math.PI / 180)} y2={20 - 13 * Math.cos(secondDegrees * Math.PI / 180)} stroke="#ff5500" strokeWidth="1" strokeLinecap="round" />
        <circle cx="20" cy="20" r="1.5" fill={stroke} />
      </svg>
    )
  }

  const cycleClock = () => {
    setClockMode(prev => (prev === 'plain' ? 'analog' : 'plain'))
  }

  return (
    <div className={`taskbar taskbar-${theme}`}>
      <div
        ref={startRef}
        className="start-button"
        onClick={() => setIsStartOpen(prev => !prev)}
      >
        <span className="start-button__brand">yeg</span>
        <span className="start-button__os">os</span>
      </div>

      {isStartOpen && (
        <div className="start-menu" ref={menuRef}>
          <span className="start-menu__label te-label">system</span>
          <button
            className="menu-button"
            onClick={() => {
              onOpenWindow(5)
              setIsStartOpen(false)
            }}
          >
            <span className="menu-button__code">00</span>
            {t.taskbar.aboutYegos}
          </button>
          <button
            className="menu-button"
            onClick={() => {
              onOpenWindow(6)
              setIsStartOpen(false)
            }}
          >
            <span className="menu-button__code">99</span>
            {t.taskbar.settings}
          </button>
          <button
            className="menu-button"
            onClick={() => {
              onOpenWindow(8)
              setIsStartOpen(false)
            }}
          >
            <span className="menu-button__code">08</span>
            {t.taskbar.terminal}
          </button>
          <button
            className="menu-button danger"
            onClick={() => {
              alert(t.taskbar.shutdownAlert)
              setIsStartOpen(false)
            }}
          >
            <span className="menu-button__code">—</span>
            {t.taskbar.shutdown}
          </button>
        </div>
      )}

      <div className="taskbar-items">
        {openWindows.map(win => {
          const mod = getModule(win.content)
          const isActive = activeWindowId === win.id && !win.isMinimized
          return (
            <button
              key={win.id}
              type="button"
              className={`taskbar-item ${isActive ? 'active' : ''} ${win.isMinimized ? 'minimized' : ''}`}
              style={{ '--item-color': getThemedItemColor(win.bgColor) }}
              onClick={() => onWindowClick(win.id)}
            >
              {mod && <span className="taskbar-item__code">{mod.id}</span>}
              <span className="taskbar-item__name">{t.windows[win.content] || win.content}</span>
            </button>
          )
        })}
      </div>

      <div className="taskbar-clock" onClick={cycleClock} title="clock mode">
        {clockMode === 'plain' ? (
          <span className="taskbar-clock-plain">
            {time.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : (
          renderAnalogClock()
        )}
      </div>

      <button
        className="taskbar-theme-toggle"
        onClick={onThemeToggle}
        type="button"
        aria-label={theme === 'light' ? 'dark mode' : 'light mode'}
      >
        {theme === 'light' ? 'D' : 'L'}
      </button>
    </div>
  )
}
