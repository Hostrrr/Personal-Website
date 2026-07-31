import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import useIsMobile from '../../../hooks/useIsMobile'
import './PaintWindowContent.css'

const COLORS = [
  '#1a1a18',
  '#ff5500',
  '#4a8fd4',
  '#5cb88a',
  '#e8c547',
  '#e04545',
  '#e88fa8',
  '#f4f3ef',
]

const BRUSH_SIZES = [
  { id: 's', size: 3 },
  { id: 'm', size: 8 },
  { id: 'l', size: 18 },
]

const CANVAS_BG = '#faf9f6'
const MAX_HISTORY = 24

export default function PaintWindowContent() {
  const { t } = useLanguage()
  const isMobile = useIsMobile()

  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)

  const [color, setColor] = useState(COLORS[0])
  const [brushId, setBrushId] = useState('m')
  const [tool, setTool] = useState('brush')
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const brushSize = BRUSH_SIZES.find((b) => b.id === brushId)?.size ?? 8

  const syncHistoryButtons = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0)
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1)
  }, [])

  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const snapshot = canvas.toDataURL('image/png')
    const next = historyRef.current.slice(0, historyIndexRef.current + 1)
    next.push(snapshot)
    if (next.length > MAX_HISTORY) next.shift()
    historyRef.current = next
    historyIndexRef.current = next.length - 1
    syncHistoryButtons()
  }, [syncHistoryButtons])

  const restoreHistory = useCallback((index) => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const dataUrl = historyRef.current[index]
    if (!canvas || !ctx || !dataUrl) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = CANVAS_BG
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = dataUrl
    historyIndexRef.current = index
    syncHistoryButtons()
  }, [syncHistoryButtons])

  const fillBackground = useCallback((ctx, width, height) => {
    ctx.fillStyle = CANVAS_BG
    ctx.fillRect(0, 0, width, height)
  }, [])

  const resizeCanvas = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = wrap.getBoundingClientRect()
    const cssW = Math.max(1, Math.floor(rect.width))
    const cssH = Math.max(1, Math.floor(rect.height))

    const prev = document.createElement('canvas')
    prev.width = canvas.width
    prev.height = canvas.height
    if (canvas.width > 0 && canvas.height > 0) {
      prev.getContext('2d').drawImage(canvas, 0, 0)
    }

    canvas.width = Math.floor(cssW * dpr)
    canvas.height = Math.floor(cssH * dpr)
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctxRef.current = ctx

    fillBackground(ctx, cssW, cssH)
    if (prev.width > 0 && prev.height > 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(prev, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    if (historyRef.current.length === 0) {
      pushHistory()
    }
  }, [fillBackground, pushHistory])

  useEffect(() => {
    resizeCanvas()
    const wrap = wrapRef.current
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver(() => resizeCanvas())
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [resizeCanvas])

  const getPoint = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const strokeTo = (point) => {
    const ctx = ctxRef.current
    const last = lastPointRef.current
    if (!ctx || !last || !point) return

    ctx.strokeStyle = tool === 'eraser' ? CANVAS_BG : color
    ctx.lineWidth = tool === 'eraser' ? brushSize * 1.6 : brushSize
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPointRef.current = point
  }

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    event.preventDefault()
    const point = getPoint(event)
    if (!point) return

    drawingRef.current = true
    lastPointRef.current = point
    canvasRef.current?.setPointerCapture?.(event.pointerId)

    const ctx = ctxRef.current
    if (ctx) {
      ctx.fillStyle = tool === 'eraser' ? CANVAS_BG : color
      ctx.beginPath()
      ctx.arc(point.x, point.y, (tool === 'eraser' ? brushSize * 1.6 : brushSize) / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const handlePointerMove = (event) => {
    if (!drawingRef.current) return
    event.preventDefault()
    strokeTo(getPoint(event))
  }

  const endStroke = (event) => {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastPointRef.current = null
    if (event?.pointerId != null) {
      try {
        canvasRef.current?.releasePointerCapture?.(event.pointerId)
      } catch {
        /* already released */
      }
    }
    pushHistory()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    fillBackground(ctx, rect.width, rect.height)
    pushHistory()
  }

  const handleUndo = () => {
    if (historyIndexRef.current <= 0) return
    restoreHistory(historyIndexRef.current - 1)
  }

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    restoreHistory(historyIndexRef.current + 1)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'yegos-paint.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className={`paint-window${isMobile ? ' paint-window--mobile' : ''}`}>
      <div className="paint-toolbar" role="toolbar" aria-label={t.paint.toolbarAria}>
        <div className="paint-toolbar__group">
          <span className="paint-toolbar__label">{t.paint.tool}</span>
          <div className="paint-toolbar__row">
            <button
              type="button"
              className={`paint-chip${tool === 'brush' ? ' paint-chip--active' : ''}`}
              onClick={() => setTool('brush')}
              aria-pressed={tool === 'brush'}
            >
              {t.paint.brush}
            </button>
            <button
              type="button"
              className={`paint-chip${tool === 'eraser' ? ' paint-chip--active' : ''}`}
              onClick={() => setTool('eraser')}
              aria-pressed={tool === 'eraser'}
            >
              {t.paint.eraser}
            </button>
          </div>
        </div>

        <div className="paint-toolbar__group">
          <span className="paint-toolbar__label">{t.paint.size}</span>
          <div className="paint-toolbar__row">
            {BRUSH_SIZES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`paint-size${brushId === item.id ? ' paint-size--active' : ''}`}
                onClick={() => setBrushId(item.id)}
                aria-label={`${t.paint.size} ${item.id}`}
                aria-pressed={brushId === item.id}
              >
                <span
                  className="paint-size__dot"
                  style={{ width: item.size + 4, height: item.size + 4 }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="paint-toolbar__group paint-toolbar__group--colors">
          <span className="paint-toolbar__label">{t.paint.color}</span>
          <div className="paint-toolbar__row paint-colors">
            {COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className={`paint-swatch${color === swatch ? ' paint-swatch--active' : ''}`}
                style={{ background: swatch }}
                onClick={() => {
                  setColor(swatch)
                  setTool('brush')
                }}
                aria-label={swatch}
                aria-pressed={color === swatch}
              />
            ))}
          </div>
        </div>

        <div className="paint-toolbar__group paint-toolbar__actions">
          <button type="button" className="paint-chip" onClick={handleUndo} disabled={!canUndo}>
            {t.paint.undo}
          </button>
          <button type="button" className="paint-chip" onClick={handleRedo} disabled={!canRedo}>
            {t.paint.redo}
          </button>
          <button type="button" className="paint-chip" onClick={handleClear}>
            {t.paint.clear}
          </button>
          <button type="button" className="paint-chip paint-chip--accent" onClick={handleDownload}>
            {t.paint.save}
          </button>
        </div>
      </div>

      <div className="paint-canvas-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="paint-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={(e) => {
            if (drawingRef.current) endStroke(e)
          }}
        />
      </div>
    </div>
  )
}
