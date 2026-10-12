import { useCallback, useState } from 'react'
import TaskBar from './TaskBar'
import DesktopBootReveal from './DesktopBootReveal'
import ScreenOffReflection from './ScreenOffReflection'
import { useLanguage } from '../hooks/useLanguage'
import { playUiClick } from '../utils/uiSound'
import './MonitorShell.css'

export default function MonitorShell({
  theme,
  children,
  taskBarProps,
  wallpaperColor,
  showBootReveal,
  onBootComplete,
  contentRef,
  canReveal,
}) {
  const { t } = useLanguage()
  const [isPoweredOn, setIsPoweredOn] = useState(true)

  const togglePower = useCallback(() => {
    playUiClick()
    setIsPoweredOn((prev) => !prev)
  }, [])

  const powerOff = useCallback(() => {
    playUiClick()
    setIsPoweredOn(false)
  }, [])

  return (
    <div
      className={`monitor-shell monitor-shell--${theme}${isPoweredOn ? '' : ' monitor-shell--off'}`}
    >
      <div className="monitor-top">
        <TaskBar theme={theme} {...taskBarProps} onShutdown={powerOff} />
      </div>

      <div className="monitor-screen">
        <div className="monitor-screen__live" aria-hidden={!isPoweredOn}>
          {children}
          {showBootReveal && contentRef && (
            <DesktopBootReveal
              contentRef={contentRef}
              wallpaperColor={wallpaperColor}
              theme={theme}
              onComplete={onBootComplete}
              canReveal={canReveal}
            />
          )}
        </div>
        {!isPoweredOn && <ScreenOffReflection />}
      </div>

      <div className="monitor-chin">
        <div className="monitor-logo">
          <span className="monitor-logo__brand">yeg</span>
          <span className="monitor-logo__os">os</span>
        </div>

        <button
          type="button"
          className={`monitor-power-btn${isPoweredOn ? ' monitor-power-btn--on' : ''}`}
          onClick={togglePower}
          aria-label={isPoweredOn ? t.monitor.powerOff : t.monitor.powerOn}
          aria-pressed={isPoweredOn}
          title={isPoweredOn ? t.monitor.powerOff : t.monitor.powerOn}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M12 3v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M7.2 6.4a7 7 0 1 0 9.6 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
