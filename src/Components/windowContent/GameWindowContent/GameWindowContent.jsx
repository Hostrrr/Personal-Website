import { useEffect, useState, useRef, useCallback } from "react"
import { useWebHaptics } from "web-haptics/react"
import "./GameWindowContent.css"
import { useLanguage } from "../../../contexts/LanguageContext"

const ROWS = 20
const COLS = 20
const INITIAL_SPEED = 120

const DIRECTIONS = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y:  1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x:  1, y: 0 },
  KeyW: { x: 0, y: -1 },
  KeyS: { x: 0, y:  1 },
  KeyA: { x: -1, y: 0 },
  KeyD: { x:  1, y: 0 },
}

function getRandomFreeCell(snake) {
  while (true) {
    const x = Math.floor(Math.random() * COLS)
    const y = Math.floor(Math.random() * ROWS)
    if (!snake.some(s => s.x === x && s.y === y)) return { x, y }
  }
}

function createInitialSnake() {
  const sx = Math.floor(COLS / 2)
  const sy = Math.floor(ROWS / 2)
  return [{ x: sx, y: sy }, { x: sx - 1, y: sy }, { x: sx - 2, y: sy }]
}

export default function GameWindowContent() {
  const { t } = useLanguage()
  const { trigger } = useWebHaptics()

  const [snake, setSnake]               = useState(createInitialSnake)
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 })
  const [food, setFood]                 = useState(() => getRandomFreeCell(createInitialSnake()))
  const [speed]                         = useState(INITIAL_SPEED)
  const [score, setScore]               = useState(0)
  const [bestScore, setBestScore]       = useState(() => {
    const saved = typeof window !== "undefined" && window.localStorage.getItem("snake_best_score")
    return saved ? Number(saved) || 0 : 0
  })
  const [status, setStatus] = useState("ready")

  const tickRef           = useRef(null)
  const lastDirectionRef  = useRef({ x: 1, y: 0 })

  // Общая логика смены направления — используется и клавиатурой, и D-pad
  const changeDirection = useCallback((dir) => {
    if (status === "gameover") return

    if (status === "ready") {
      setStatus("running")
    }

    const current = lastDirectionRef.current
    if (current.x + dir.x === 0 && current.y + dir.y === 0) return

    setNextDirection(dir)
  }, [status])

  // Клавиатура
  useEffect(() => {
    const handleKeyDown = (e) => {
      const dir = DIRECTIONS[e.code]
      if (!dir) return
      e.preventDefault()
      changeDirection(dir)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [changeDirection])

  // Игровой тик
  useEffect(() => {
    if (status !== "running") {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
      return
    }

    tickRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const dir = nextDirection
        lastDirectionRef.current = dir
        const head    = prevSnake[0]
        const newHead = { x: head.x + dir.x, y: head.y + dir.y }

        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
          setStatus("gameover")
          return prevSnake
        }
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setStatus("gameover")
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1)
          setFood(getRandomFreeCell(newSnake))
        } else {
          newSnake.pop()
        }
        return newSnake
      })
    }, speed)

    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null } }
  }, [status, nextDirection, food, speed])

  // Рекорд
  useEffect(() => {
    if (status === "gameover") {
      setBestScore(prev => {
        const next = Math.max(prev, score)
        if (typeof window !== "undefined") window.localStorage.setItem("snake_best_score", String(next))
        return next
      })
    }
  }, [status, score])

  const handleStartPause = () => {
    if (status === "ready" || status === "gameover") { handleRestart(); return }
    setStatus(s => s === "running" ? "paused" : "running")
  }

  const handleRestart = () => {
    const s = createInitialSnake()
    setSnake(s)
    setNextDirection({ x: 1, y: 0 })
    lastDirectionRef.current = { x: 1, y: 0 }
    setFood(getRandomFreeCell(s))
    setScore(0)
    setStatus("running")
  }

  // D-pad нажатие
  const handleDpad = (dir) => {
    trigger('light')
    changeDirection(dir)
  }

  const isSnakeCell = (x, y) => snake.some(s => s.x === x && s.y === y)
  const isHead      = (x, y) => snake[0].x === x && snake[0].y === y

  const board = (
    <div
      className={`snake-board ${status === "gameover" ? "snake-board-gameover" : ""}`}
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className={[
              "snake-cell",
              isSnakeCell(col, row) ? "snake-cell-body" : "",
              isHead(col, row)      ? "snake-cell-head"  : "",
              food.x === col && food.y === row ? "snake-cell-food" : "",
            ].filter(Boolean).join(" ")}
          />
        ))
      )}
    </div>
  )

  return (
    <div className="game-window">

      {/* ── Desktop layout ─────────────────────────────── */}
      <div className="game-desktop">
        <div className="snake-board-wrapper">
          {board}
          {status === "ready"    && <div className="snake-overlay">{t.game.pressArrowDesktop}</div>}
          {status === "paused"   && <div className="snake-overlay">{t.game.pause}</div>}
          {status === "gameover" && <div className="snake-overlay">{t.game.gameOver}<br />{t.game.score}: {score}</div>}
        </div>

        <div className="game-sidebar">
          <div className="game-title">{t.game.snakeName}</div>
          <span className="game-stat-badge">{t.game.score}: {score}</span>
          <span className="game-stat-badge">{t.game.best}: {bestScore}</span>
          <button className="game-restart-btn" onClick={handleStartPause}>
            {status === "running"  && t.game.pause}
            {status === "paused"   && t.game.resume}
            {status === "ready"    && t.game.start}
            {status === "gameover" && t.game.restart}
          </button>
        </div>
      </div>

      {/* ── Mobile layout ──────────────────────────────── */}
      <div className="game-mobile">

        {/* Верхняя строка: статы + пауза */}
        <div className="game-mobile-topbar">
          <span className="game-stat-badge">🏆 {bestScore}</span>
          <div className="game-title">{t.game.snakeName}</div>
          <button className="game-restart-btn game-restart-btn--mobile" onClick={handleStartPause}>
            {status === "running"  && "⏸"}
            {status === "paused"   && "▶"}
            {status === "ready"    && "▶"}
            {status === "gameover" && "↺"}
          </button>
        </div>

        <div className="game-mobile-score">{t.game.score}: {score}</div>

        {/* Поле */}
        <div className="snake-board-wrapper snake-board-wrapper--mobile">
          {board}
          {status === "ready"    && <div className="snake-overlay">{t.game.pressArrowMobile}</div>}
          {status === "paused"   && <div className="snake-overlay">{t.game.pause}</div>}
          {status === "gameover" && <div className="snake-overlay">{t.game.gameOver}<br />{t.game.score}: {score}</div>}
        </div>

        {/* D-pad */}
        <div className="dpad">
          <button
            className="dpad-btn dpad-btn--up"
            onPointerDown={(e) => { e.preventDefault(); handleDpad({ x: 0, y: -1 }) }}
            aria-label={t.game.up}
          >↑</button>
          <button
            className="dpad-btn dpad-btn--left"
            onPointerDown={(e) => { e.preventDefault(); handleDpad({ x: -1, y: 0 }) }}
            aria-label={t.game.left}
          >←</button>
          <button
            className="dpad-btn dpad-btn--down"
            onPointerDown={(e) => { e.preventDefault(); handleDpad({ x: 0, y: 1 }) }}
            aria-label={t.game.down}
          >↓</button>
          <button
            className="dpad-btn dpad-btn--right"
            onPointerDown={(e) => { e.preventDefault(); handleDpad({ x: 1, y: 0 }) }}
            aria-label={t.game.right}
          >→</button>
        </div>

      </div>
    </div>
  )
}
