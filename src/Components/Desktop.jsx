import { useCallback, useEffect, useRef, useState } from 'react'
import Window from './Window'
import MonitorShell from './MonitorShell'
import CommandPalette from './CommandPalette'
import './Desktop.css'
import { useLanguage } from '../hooks/useLanguage'
import { OsActionsProvider } from '../contexts/OsActionsContext'
import { useCommandPaletteToggle } from '../hooks/useCommandPaletteToggle'
import { useOsPreferences } from '../hooks/useOsPreferences'
import useHashRoute, { setHashRoute } from '../hooks/useHashRoute'
import { darkenAndSaturate } from '../utils/colorUtils'
import { getModule } from '../config/osModules'
import DockIcon from './icons/DockIcon'
import { playUiOpen } from '../utils/uiSound'

export default function Desktop() {
  const { t } = useLanguage()
  const {
    theme,
    setTheme,
    toggleTheme,
    wallpaperColor,
    setWallpaperColor,
    soundEnabled,
    setSoundEnabled,
  } = useOsPreferences()

  const [windows, setWindows] = useState([
    { id: 1, isOpen: true, isMinimized: false, isMaximized: false, content: 'about', bgColor: '#f4f3ef', zIndex: 10 },
    { id: 2, isOpen: false, isMinimized: false, isMaximized: false, content: 'projects', bgColor: '#e8e6e1', zIndex: 10 },
    { id: 3, isOpen: false, isMinimized: false, isMaximized: false, content: 'skills', bgColor: '#dde8de', zIndex: 10 },
    { id: 4, isOpen: false, isMinimized: false, isMaximized: false, content: 'contact', bgColor: '#d4e4ed', zIndex: 10 },
    { id: 5, isOpen: false, isMinimized: false, isMaximized: false, content: 'yegos', bgColor: '#e5ddd8', isResizable: false, width: 350, height: 300, skipDock: true, defaultDarkColor: '#3e3e3c', zIndex: 10 },
    { id: 6, isOpen: false, isMinimized: false, isMaximized: false, content: 'settings', bgColor: '#e8e4dc', isResizable: false, width: 400, height: 350, defaultDarkColor: '#3e3e3c', zIndex: 10 },
    { id: 7, isOpen: false, isMinimized: false, isMaximized: false, content: 'game', bgColor: '#e5ddd8', zIndex: 10 },
    { id: 8, isOpen: false, isMinimized: false, isMaximized: false, content: 'terminal', bgColor: '#2a2a28', defaultDarkColor: '#1a1a18', width: 520, height: 380, zIndex: 10 },
  ])

  const [activeWindowId, setActiveWindowId] = useState(1)
  const [zIndexCounter, setZIndexCounter] = useState(10)
  const [showBootReveal, setShowBootReveal] = useState(true)
  const windowsRef = useRef(windows)
  const desktopRef = useRef(null)
  const palette = useCommandPaletteToggle()

  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  const getThemedBgColor = (color, defaultDarkColor) => {
    if (!color) return color
    if (theme === 'dark' && defaultDarkColor) return defaultDarkColor
    return theme === 'dark' ? darkenAndSaturate(color) : color
  }

  const openWindow = useCallback((id) => {
    playUiOpen()
    setZIndexCounter((prevZ) => {
      const newZ = prevZ + 1
      setWindows((prevWindows) => {
        const target = prevWindows.find((win) => win.id === id)
        if (target) setHashRoute(target.content)
        return prevWindows.map((win) =>
          win.id === id ? { ...win, isOpen: true, isMinimized: false, zIndex: newZ } : win
        )
      })
      return newZ
    })
    setActiveWindowId(id)
  }, [])

  const closeWindow = (id) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, isOpen: false } : win)))
    setActiveWindowId((prev) => (prev === id ? null : prev))
  }

  const minimizeWindow = (id) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win)))
    setActiveWindowId((prev) => (prev === id ? null : prev))
  }

  const toggleMaximize = (id) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, isMaximized: !win.isMaximized } : win)))
    setActiveWindowId(id)
  }

  const focusWindow = (id) => {
    setActiveWindowId(id)
    let nextZ = zIndexCounter
    setZIndexCounter((prevZ) => {
      nextZ = prevZ + 1
      setWindows((prevWindows) =>
        prevWindows.map((win) => (win.id === id ? { ...win, zIndex: nextZ } : win))
      )
      return nextZ
    })
    return nextZ
  }

  const openByContent = useCallback((content) => {
    const win = windowsRef.current.find((w) => w.content === content)
    if (win) openWindow(win.id)
  }, [openWindow])

  useHashRoute(openByContent)

  const osActionsValue = {
    theme,
    setTheme,
    setWallpaperColor,
    openByContent,
    soundEnabled,
    setSoundEnabled,
  }

  const handleDockKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openWindow(id)
    }
  }

  return (
    <OsActionsProvider value={osActionsValue}>
      <MonitorShell
        theme={theme}
        wallpaperColor={wallpaperColor}
        showBootReveal={showBootReveal}
        onBootComplete={() => setShowBootReveal(false)}
        contentRef={desktopRef}
        taskBarProps={{
          onThemeToggle: toggleTheme,
          onOpenWindow: openWindow,
        }}
      >
        <div
          ref={desktopRef}
          className={`desktop desktop-${theme}`}
          style={{
            backgroundColor: wallpaperColor,
            backgroundImage: theme === 'dark' ? 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))' : 'none',
          }}
        >
          <div className="dock" role="toolbar" aria-label="Dock">
            {windows.filter((w) => !w.skipDock).map((win) => {
              const isActive = activeWindowId === win.id && win.isOpen && !win.isMinimized
              const mod = getModule(win.content)
              const label = t.windows[win.content] || win.content

              return (
                <div
                  key={win.id}
                  className="dock-item"
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  onClick={() => openWindow(win.id)}
                  onKeyDown={(event) => handleDockKeyDown(event, win.id)}
                  style={{
                    opacity: win.isOpen ? 1 : 0.8,
                    transform: isActive ? 'translateY(-15px) scale(1.08)' : undefined,
                  }}
                >
                  <div
                    className="dock-icon"
                    style={{
                      background: isActive ? getThemedBgColor(win.bgColor, win.defaultDarkColor) : undefined,
                    }}
                  >
                    <DockIcon name={win.content} size={36} />
                  </div>
                  <div className="dock-label">
                    {mod && <span className="dock-label__code">{mod.id}</span>}
                    <span className="dock-label__text">{label}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {windows.map((win) =>
            win.isOpen && !win.isMinimized && (
              <Window
                key={win.id}
                id={win.id}
                title={t.windows[win.content] || win.content}
                moduleCode={getModule(win.content)?.id}
                content={win.content}
                bgColor={getThemedBgColor(win.bgColor, win.defaultDarkColor)}
                isMaximized={win.isMaximized}
                isResizable={win.isResizable !== false}
                initialWidth={win.width}
                initialHeight={win.height}
                initialZIndex={win.zIndex}
                theme={theme}
                onThemeToggle={toggleTheme}
                wallpaperColor={wallpaperColor}
                onWallpaperChange={setWallpaperColor}
                soundEnabled={soundEnabled}
                onSoundToggle={() => setSoundEnabled(!soundEnabled)}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() => toggleMaximize(win.id)}
                onFocus={() => focusWindow(win.id)}
              />
            )
          )}

          <CommandPalette key={palette.session} isOpen={palette.isOpen} onClose={palette.close} />
        </div>
      </MonitorShell>
    </OsActionsProvider>
  )
}
