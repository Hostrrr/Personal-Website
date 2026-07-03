import { useRef } from 'react'
import TaskBar from './TaskBar'
import DesktopBootReveal from './DesktopBootReveal'
import './MonitorShell.css'

export default function MonitorShell({
  theme,
  children,
  taskBarProps,
  wallpaperColor,
  showBootReveal,
  onBootComplete,
}) {
  const screenRef = useRef(null)

  return (
    <div className={`monitor-outer monitor-outer--${theme}`}>
      <div className={`monitor-shell monitor-shell--${theme}`}>
        <div className="monitor-top">
          <TaskBar theme={theme} {...taskBarProps} />
        </div>

        <div className="monitor-screen" ref={screenRef}>
          {children}
          {showBootReveal && (
            <DesktopBootReveal
              screenRef={screenRef}
              wallpaperColor={wallpaperColor}
              theme={theme}
              onComplete={onBootComplete}
            />
          )}
        </div>

        <div className="monitor-chin">
          <div className="monitor-logo">
            <span className="monitor-logo__brand">yeg</span>
            <span className="monitor-logo__os">os</span>
          </div>
        </div>
      </div>
    </div>
  )
}
