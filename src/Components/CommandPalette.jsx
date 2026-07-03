import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useOsActions } from '../hooks/useOsActions'
import { buildCommandContext, getCommandList } from '../utils/osCommands'
import { playUiClick } from '../utils/uiSound'
import './CommandPalette.css'

export default function CommandPalette({ isOpen, onClose }) {
  const { t, setLanguage } = useLanguage()
  const { theme, setTheme, setWallpaperColor, openByContent } = useOsActions()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef(null)
  const listRef = useRef(null)

  const ctx = useMemo(() => buildCommandContext({
    t,
    theme,
    setTheme,
    setLanguage,
    setWallpaperColor,
    openByContent,
  }), [t, theme, setTheme, setLanguage, setWallpaperColor, openByContent])

  const allItems = useMemo(() => getCommandList(ctx), [ctx])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allItems
    return allItems.filter(item => {
      const haystack = `${item.label} ${item.keywords || ''} ${item.code || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [allItems, query])

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    setSelectedIndex(0)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, Math.max(0, filtered.length - 1)))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered.length, onClose])

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex, filtered.length])

  const runItem = useCallback((item) => {
    playUiClick()
    item.run()
    onClose()
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    const item = filtered[selectedIndex]
    if (item) runItem(item)
  }

  if (!isOpen) return null

  return (
    <div className="cmd-palette-backdrop" onMouseDown={onClose}>
      <div
        className="cmd-palette"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t.terminal.paletteTitle}
      >
        <form className="cmd-palette__search" onSubmit={handleSubmit}>
          <span className="cmd-palette__hint">⌘K</span>
          <input
            ref={inputRef}
            className="cmd-palette__input"
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={t.terminal.palettePlaceholder}
            spellCheck={false}
            autoComplete="off"
          />
        </form>

        <div className="cmd-palette__list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-palette__empty">{t.terminal.paletteEmpty}</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`cmd-palette__item${i === selectedIndex ? ' cmd-palette__item--active' : ''}`}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => runItem(item)}
              >
                {item.code && <span className="cmd-palette__code">{item.code}</span>}
                <span className="cmd-palette__label">{item.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
