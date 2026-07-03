import { useCallback, useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { initGL, glRender, loadTextureFromCanvas, PRESETS } from '../pixel-engine/hooks/glEngine'
import './DesktopBootReveal.css'

function createFallbackCanvas(width, height, wallpaperColor, theme) {
  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.round(width * dpr))
  canvas.height = Math.max(1, Math.round(height * dpr))
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.scale(dpr, dpr)
  ctx.fillStyle = wallpaperColor || '#f4f3ef'
  ctx.fillRect(0, 0, width, height)

  if (theme === 'dark') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(0, 0, width, height)
  }

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(26,26,24,0.08)'
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  const step = 24
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  return canvas
}

export default function DesktopBootReveal({ screenRef, wallpaperColor, theme, onComplete }) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const glRef = useRef(null)
  const rafRef = useRef(null)
  const pxRef = useRef(48)
  const fadingRef = useRef(false)

  const startReveal = useCallback((fromPixels = 48, speed = 70) => {
    const ctx = glRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    pxRef.current = fromPixels
    const { mode, border } = PRESETS.default
    let last = null

    function step(ts) {
      if (!last) last = ts
      const dt = (ts - last) / 1000
      last = ts
      pxRef.current = Math.max(1, pxRef.current - speed * dt)
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border)

      if (pxRef.current <= 8 && !fadingRef.current) {
        fadingRef.current = true
        overlayRef.current?.classList.add('desktop-boot-reveal--fading')
      }

      if (pxRef.current > 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    const screen = screenRef.current
    const overlay = overlayRef.current
    if (!canvas || !screen) return

    const ctx = initGL(canvas)
    if (!ctx) {
      onComplete?.()
      return
    }
    glRef.current = ctx

    let cancelled = false

    const setup = async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      if (cancelled) return

      const rect = screen.getBoundingClientRect()
      if (overlay) overlay.style.visibility = 'hidden'

      let sourceCanvas
      try {
        sourceCanvas = await toCanvas(screen, {
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          cacheBust: true,
        })
      } catch {
        sourceCanvas = createFallbackCanvas(rect.width, rect.height, wallpaperColor, theme)
      }

      if (overlay) overlay.style.visibility = 'visible'
      if (cancelled) return

      canvas.width = sourceCanvas.width
      canvas.height = sourceCanvas.height
      loadTextureFromCanvas(ctx.gl, ctx.tex, sourceCanvas)

      const { mode, border } = PRESETS.default
      glRender(ctx.gl, ctx.prog, canvas, 48, mode, border)
      startReveal()
    }

    setup()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [screenRef, wallpaperColor, theme, onComplete, startReveal])

  return (
    <div ref={overlayRef} className="desktop-boot-reveal">
      <canvas ref={canvasRef} className="desktop-boot-reveal__canvas" />
    </div>
  )
}
