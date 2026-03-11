import { useState, useEffect, useRef } from 'react'
import './LockScreen.css'
import { useLanguage } from '../../contexts/LanguageContext'

export default function LockScreen({ isLocked, onUnlock }) {
  const { t } = useLanguage()
  const [time, setTime] = useState(new Date())
  const touchStartY = useRef(null)

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

  const handlePointerDown = (e) => {
    touchStartY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerUp = (e) => {
    if (touchStartY.current === null) return
    const delta = touchStartY.current - e.clientY
    if (delta > 60) {
      onUnlock()
    }
    touchStartY.current = null
  }

  return (
    <div
      className={`lock-screen${isLocked ? '' : ' lock-screen--hidden'}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="lock-screen__blob lock-screen__blob--1" />
      <div className="lock-screen__blob lock-screen__blob--2" />
      <div className="lock-screen__blob lock-screen__blob--3" />
      <div className="lock-screen__blob lock-screen__blob--4" />

      <div className="lock-screen__status-bar">
        <span className="lock-screen__status-time">{hours}:{minutes}</span>
        <div className="lock-screen__status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      <div className="lock-screen__content">
        <div className="lock-screen__time">
          {hours}:{minutes}
        </div>
        <div className="lock-screen__date">{dateStr}</div>
      </div>

      <div className="lock-screen__swipe-hint">
        <div className="lock-screen__arrow">↑</div>
        <span>{t.mobile.swipeHint}</span>
      </div>
    </div>
  )
}
