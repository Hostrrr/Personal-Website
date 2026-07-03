import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import WindowContent from './WindowContent'
import { useLanguage } from '../hooks/useLanguage'
import './Window.css'

export default function Window({
  id,
  title,
  moduleCode,
  content,
  bgColor,
  isMaximized,
  isResizable = true,
  initialWidth,
  initialHeight,
  initialZIndex = 10,
  theme,
  onThemeToggle,
  wallpaperColor,
  onWallpaperChange,
  soundEnabled,
  onSoundToggle,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) {
  const { t } = useLanguage()
  const titleBar = (
    <div className="window-title">
      {moduleCode && <span className="window-title__code">{moduleCode}</span>}
      <span className="window-title__text">{title}</span>
    </div>
  )
  const [zIndex, setZIndex] = useState(initialZIndex)
  const [savedPosition, setSavedPosition] = useState({ x: 100 + (id * 30), y: 60 + (id * 30) })
  const [savedSize, setSavedSize] = useState({ width: initialWidth || 500, height: initialHeight || 400 })
  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    setZIndex(initialZIndex)
  }, [initialZIndex])

  const handleMouseDown = () => {
    setZIndex(onFocus())
  }

  const handleClose = () => {
    setAnimation('closing')
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleMinimize = () => {
    setAnimation('closing')
    setTimeout(() => {
      onMinimize()
    }, 200)
  }

  const handleMaximize = () => {
    if (!isMaximized) {
      setSavedPosition({ x: savedPosition.x, y: savedPosition.y })
      setSavedSize({ width: savedSize.width, height: savedSize.height })
      onMaximize()
      return
    }

    setAnimation('unmaximizing')
    setTimeout(() => {
      onMaximize()
      setAnimation(null)
    }, 250)
  }

  const windowControls = (
    <div className="window-controls">
      <button type="button" className="window-btn minimize" onClick={handleMinimize} aria-label={t.window.minimize}>_</button>
      {isResizable && (
        <button type="button" className="window-btn maximize" onClick={handleMaximize} aria-label={t.window.maximize}>❐</button>
      )}
      <button type="button" className="window-btn close" onClick={handleClose} aria-label={t.window.close}>✕</button>
    </div>
  )

  const windowBody = (
    <WindowContent
      type={content}
      theme={theme}
      onThemeToggle={onThemeToggle}
      wallpaperColor={wallpaperColor}
      onWallpaperChange={onWallpaperChange}
      soundEnabled={soundEnabled}
      onSoundToggle={onSoundToggle}
    />
  )

  if (isMaximized) {
    return (
      <div
        className={`window maximized ${
          animation === 'closing' ? 'window-closing' : ''
        } ${
          animation === 'unmaximizing' ? 'window-unmaximizing' : ''
        }`}
        style={{ zIndex }}
        onMouseDown={handleMouseDown}
      >
        <div className="window-header">
          {titleBar}
          {windowControls}
        </div>

        <div className="window-content" style={{ background: bgColor || 'white' }}>
          {windowBody}
        </div>
      </div>
    )
  }

  return (
    <Rnd
      position={savedPosition}
      size={savedSize}
      onDragStop={(e, d) => {
        setSavedPosition({ x: d.x, y: d.y })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSavedSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        })
        setSavedPosition(position)
      }}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      enableResizing={isResizable ? {
        top: false,
        right: true,
        bottom: true,
        left: true,
        topRight: false,
        bottomRight: true,
        bottomLeft: true,
        topLeft: false,
      } : false}
      dragHandleClassName="window-header"
      onMouseDown={handleMouseDown}
      style={{ zIndex }}
    >
      <div className={`window ${animation === 'closing' ? 'window-closing' : ''}`}>
        <div className="window-header">
          {titleBar}
          {windowControls}
        </div>

        <div className="window-content" style={{ background: bgColor || 'white' }}>
          {windowBody}
        </div>
      </div>
    </Rnd>
  )
}
