import { useState } from 'react'
import Window from './Window'
import TaskBar from './TaskBar'
import CommandPalette from './CommandPalette'
import './Desktop.css'
import { useLanguage } from '../contexts/LanguageContext'
import { OsActionsProvider } from '../contexts/OsActionsContext'
import { useCommandPaletteToggle } from '../hooks/useCommandPaletteToggle'
import { darkenAndSaturate } from '../utils/colorUtils'
import { getModule } from '../config/osModules'
import DockIcon from './icons/DockIcon'
import { playUiOpen } from '../utils/uiSound'

export default function Desktop() {
  const { t } = useLanguage()

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

  // активное окно и счётчик z-index для красивого наложения
  const [activeWindowId, setActiveWindowId] = useState(1)
  const [zIndexCounter, setZIndexCounter] = useState(10)

  // тема оформления: light / dark
  const [theme, setThemeMode] = useState('light')
  const [wallpaperColor, setWallpaperColor] = useState('#e8e6e1')
  const palette = useCommandPaletteToggle()

  const setTheme = (mode) => setThemeMode(mode)

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const getThemedBgColor = (color, defaultDarkColor) => {
    if (!color) return color
    if (theme === 'dark' && defaultDarkColor) return defaultDarkColor
    // в тёмной теме — более тёмный и более насыщенный оттенок
    return theme === 'dark' ? darkenAndSaturate(color) : color
  }

  // Открыть окно
  const openWindow = (id) => {
    playUiOpen()
    const newZ = zIndexCounter + 1
    setZIndexCounter(newZ)
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isOpen: true, isMinimized: false, zIndex: newZ } : win
    ))
    setActiveWindowId(id)
  }

  // Закрыть окно
  const closeWindow = (id) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isOpen: false } : win
    ))
    setActiveWindowId(prev => (prev === id ? null : prev))
  }

  // Минимизировать окно
  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: true } : win
    ))
    setActiveWindowId(prev => (prev === id ? null : prev))
  }

  // Максимизировать/восстановить окно
  const toggleMaximize = (id) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
    ))
    setActiveWindowId(id)
  }

  // Фокус на окне (поднять z-index)
  const focusWindow = (id) => {
    setActiveWindowId(id)
    const newZ = zIndexCounter + 1
    setZIndexCounter(newZ)
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, zIndex: newZ } : win
    ))
    return newZ
  }

  const openByContent = (content) => {
    const win = windows.find(w => w.content === content)
    if (win) openWindow(win.id)
  }

  const osActionsValue = {
    theme,
    setTheme,
    setWallpaperColor,
    openByContent,
  }

  return (
    <OsActionsProvider value={osActionsValue}>
    <div className={`desktop desktop-${theme}`} style={{ 
      backgroundColor: wallpaperColor,
      backgroundImage: theme === 'dark' ? 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))' : 'none'
    }}>
      {/* Dock (как на macOS) */}
      <div className="dock">
        {windows.filter(w => !w.skipDock).map(win => {
          const isActive = activeWindowId === win.id && win.isOpen && !win.isMinimized
          const mod = getModule(win.content)

          return (
            <div
              key={win.id}
              className="dock-item"
              onClick={() => openWindow(win.id)}
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
                <span className="dock-label__text">{t.windows[win.content] || win.content}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Windows */}
      {windows.map(win => 
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
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            onFocus={() => focusWindow(win.id)}
          />
        )
      )}


      <TaskBar
        windows={windows}
        activeWindowId={activeWindowId}
        theme={theme}
        onThemeToggle={toggleTheme}
        onWindowClick={(id) => {
          const win = windows.find(w => w.id === id)
          if (!win) return

          // если окно закрыто — открыть
          if (!win.isOpen) {
            openWindow(id)
            return
          }

          // если свернуто — развернуть и сделать активным
          if (win.isMinimized) {
            setWindows(prev => prev.map(w => 
              w.id === id ? { ...w, isMinimized: false, isOpen: true } : w
            ))
            setActiveWindowId(id)
            return
          }

          // если уже активно — свернуть
          if (activeWindowId === id) {
            minimizeWindow(id)
            return
          }

          // иначе просто сфокусировать
          focusWindow(id)
        }}
        onOpenWindow={openWindow}
      />

      <CommandPalette key={palette.session} isOpen={palette.isOpen} onClose={palette.close} />
    </div>
    </OsActionsProvider>
  )
}
