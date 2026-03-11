import { useState, useEffect } from 'react'
import { Rnd } from 'react-rnd'
import WindowContent from './WindowContent'
import './Window.css'

export default function Window({ id, title, content, bgColor, isMaximized, isResizable = true, initialWidth, initialHeight, initialZIndex = 10, theme, onThemeToggle, wallpaperColor, onWallpaperChange, onClose, onMinimize, onMaximize, onFocus }) {
  const [zIndex, setZIndex] = useState(initialZIndex)
  const [savedPosition, setSavedPosition] = useState({ x: 100 + (id * 30), y: 60 + (id * 30) })
  const [savedSize, setSavedSize] = useState({ width: initialWidth || 500, height: initialHeight || 400 })
  const [animation, setAnimation] = useState(null) // 'closing' | 'unmaximizing' | null

  useEffect(() => {
    setZIndex(initialZIndex)
  }, [initialZIndex])

  const handleMouseDown = () => {
    setZIndex(onFocus())
  }

  const handleClose = () => {
    setAnimation('closing')
    // даём анимации проиграться, затем реально закрываем
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
    // вход в фуллскрин
    if (!isMaximized) {
      setSavedPosition({ x: savedPosition.x, y: savedPosition.y })
      setSavedSize({ width: savedSize.width, height: savedSize.height })
      onMaximize()
      return
    }

    // выход из фуллскрина с красивой анимацией
    setAnimation('unmaximizing')
    setTimeout(() => {
      onMaximize()
      setAnimation(null)
    }, 250)
  }

  // Если максимизировано - рендерим обычный div с CSS
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
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button className="window-btn minimize" onClick={handleMinimize}>_</button>
            {isResizable && <button className="window-btn maximize" onClick={handleMaximize}>❐</button>}
            <button className="window-btn close" onClick={handleClose}>✕</button>
          </div>
        </div>

        <div className="window-content" style={{ background: bgColor || 'white' }}>
          <WindowContent type={content} theme={theme} onThemeToggle={onThemeToggle} wallpaperColor={wallpaperColor} onWallpaperChange={onWallpaperChange} />
        </div>
      </div>
    )
  }

  // Обычное окно через Rnd
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
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button className="window-btn minimize" onClick={handleMinimize}>_</button>
            {isResizable && <button className="window-btn maximize" onClick={handleMaximize}>□</button>}
            <button className="window-btn close" onClick={handleClose}>✕</button>
          </div>
        </div>

        <div className="window-content" style={{ background: bgColor || 'white' }}>
          <WindowContent type={content} theme={theme} onThemeToggle={onThemeToggle} wallpaperColor={wallpaperColor} onWallpaperChange={onWallpaperChange} />
        </div>
      </div>
    </Rnd>
  )
}
