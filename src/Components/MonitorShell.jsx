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
  contentRef,
}) {
  return (
    <div className={`monitor-shell monitor-shell--${theme}`}>
      <div className="monitor-top">
        <TaskBar theme={theme} {...taskBarProps} />
      </div>

      <div className="monitor-screen">
        {children}
        {showBootReveal && contentRef && (
          <DesktopBootReveal
            contentRef={contentRef}
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
  )
}
