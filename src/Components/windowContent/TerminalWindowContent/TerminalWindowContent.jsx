import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useOsActions } from '../../../contexts/OsActionsContext'
import { buildCommandContext, executeCommand } from '../../../utils/osCommands'
import useIsMobile from '../../../hooks/useIsMobile'
import './TerminalWindowContent.css'

const MAX_HISTORY = 50

export default function TerminalWindowContent() {
  const { t, setLanguage } = useLanguage()
  const { theme, setTheme, setWallpaperColor, openByContent } = useOsActions()
  const isMobile = useIsMobile()

  const [lines, setLines] = useState(() => [
    { type: 'system', text: isMobile ? t.terminal.welcomeMobile : t.terminal.welcomeDesktop },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const outputRef = useRef(null)
  const inputRef = useRef(null)

  const getCtx = useCallback(() => buildCommandContext({
    t,
    theme,
    setTheme,
    setLanguage,
    setWallpaperColor,
    openByContent,
  }), [t, theme, setTheme, setLanguage, setWallpaperColor, openByContent])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const appendOutput = (newLines, ok) => {
    if (!newLines.length) return
    setLines(prev => [
      ...prev,
      ...newLines.map(text => ({ type: ok ? 'out' : 'err', text })),
    ])
  }

  const runCommand = (raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setLines(prev => [...prev, { type: 'in', text: `${t.terminal.prompt} ${trimmed}` }])

    if (trimmed.toLowerCase() === 'clear') {
      setLines([])
      return
    }

    const result = executeCommand(trimmed, getCtx())

    if (result.clear) {
      setLines([])
      return
    }

    appendOutput(result.lines, result.ok)

    setHistory(prev => {
      const next = prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]
      return next.slice(-MAX_HISTORY)
    })
    setHistoryIndex(-1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex < 0) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
    }
  }

  return (
    <div className="terminal-root" onClick={() => inputRef.current?.focus()}>
      <div ref={outputRef} className="terminal-output">
        {lines.map((line, i) => (
          <div
            key={`${i}-${line.text}`}
            className={`terminal-line terminal-line--${line.type}`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <form className="terminal-input-row" onSubmit={handleSubmit}>
        <span className="terminal-prompt">{t.terminal.prompt}</span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label={t.terminal.inputAria}
        />
      </form>
    </div>
  )
}
