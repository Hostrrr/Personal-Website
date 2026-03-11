import './TaskBar.css'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { darkenAndSaturate } from '../utils/colorUtils'

export default function TaskBar({ windows, activeWindowId, theme, onThemeToggle, onWindowClick, onOpenWindow }) {
  const { t, language } = useLanguage()
  const openWindows = windows.filter(w => w.isOpen)

  const [isStartOpen, setIsStartOpen] = useState(false)
  const [clockMode, setClockMode] = useState('digital') // 'digital' | 'analog'
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
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
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

    return (
      <svg width="36" height="36" viewBox="0 0 40 40" style={{ cursor: 'pointer' }}>
        <circle cx="20" cy="20" r="18" fill="none" stroke={theme === 'dark' ? '#f5f5f5' : '#000000'} strokeWidth="1.5" />
        
        {/* Hour markers */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
          const angle = (i * 30) * (Math.PI / 180)
          const x1 = 20 + 16 * Math.sin(angle)
          const y1 = 20 - 16 * Math.cos(angle)
          const x2 = 20 + 14 * Math.sin(angle)
          const y2 = 20 - 14 * Math.cos(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme === 'dark' ? '#f5f5f5' : '#000000'} strokeWidth="1.5" />
        })}

        {/* Hour hand */}
        <line x1="20" y1="20" x2={20 + 8 * Math.sin(hourDegrees * Math.PI / 180)} y2={20 - 8 * Math.cos(hourDegrees * Math.PI / 180)} stroke={theme === 'dark' ? '#f5f5f5' : '#000000'} strokeWidth="2" strokeLinecap="round" />
        
        {/* Minute hand */}
        <line x1="20" y1="20" x2={20 + 12 * Math.sin(minuteDegrees * Math.PI / 180)} y2={20 - 12 * Math.cos(minuteDegrees * Math.PI / 180)} stroke={theme === 'dark' ? '#f5f5f5' : '#000000'} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Second hand */}
        <line x1="20" y1="20" x2={20 + 13 * Math.sin(secondDegrees * Math.PI / 180)} y2={20 - 13 * Math.cos(secondDegrees * Math.PI / 180)} stroke="#ff0000" strokeWidth="1" strokeLinecap="round" />
        
        {/* Center dot */}
        <circle cx="20" cy="20" r="1.5" fill={theme === 'dark' ? '#f5f5f5' : '#000000'} />
      </svg>
    )
  }

  return (
    <div className={`taskbar taskbar-${theme}`}>
      <div 
        ref={startRef}
        className="start-button"
        onClick={() => setIsStartOpen(prev => !prev)}
      >
        YegOS
      </div>
{isStartOpen && (
  <div className="start-menu" ref={menuRef}>

    <button 
  className="menu-button"
  onClick={() => {
    onOpenWindow(5)
    setIsStartOpen(false)
  }}
  >
    {t.taskbar.aboutYegos}
  </button>

  <button 
    className="menu-button"
    onClick={() => {
      onOpenWindow(6)
      setIsStartOpen(false)
    }}
  >
    {t.taskbar.settings}
  </button>

  <button 
    className="menu-button danger"
    onClick={() => {
      alert(t.taskbar.shutdownAlert)
      setIsStartOpen(false)
    }}
  >
    {t.taskbar.shutdown}
  </button>
</div>
)}



      <div 
        className="taskbar-clock" 
        onClick={() => setClockMode(clockMode === 'digital' ? 'analog' : 'digital')}
      >
        {clockMode === 'digital' ? (
          time.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        ) : (
          renderAnalogClock()
        )}
      </div>

      <button 
        className="taskbar-theme-toggle"
        onClick={onThemeToggle}
        type="button"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
