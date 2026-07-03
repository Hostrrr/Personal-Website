import { useEffect, useRef } from 'react'
import { initGL, glRender, loadTextureFromCanvas, PRESETS } from '../pixel-engine/hooks/glEngine'
import './DesktopBootReveal.css'

const FROM_PIXELS = 48
const SPEED = 38
const FADE_START = 20

function createWallpaperCanvas(width, height, wallpaperColor, theme) {
  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.max(1, Math.round(width * dpr))
  const h = Math.max(1, Math.round(height * dpr))
  canvas.width = w
  canvas.height = h
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
  const pxRef = useRef(FROM_PIXELS)

  useEffect(() => {
    const canvas = canvasRef.current
    const screen = screenRef.current
    const overlay = overlayRef.current
    if (!canvas || !screen || !overlay) return

    const ctx = initGL(canvas)
    if (!ctx) {
      onComplete?.()
      return
    }
    glRef.current = ctx

    const rect = screen.getBoundingClientRect()
    const sourceCanvas = createWallpaperCanvas(rect.width, rect.height, wallpaperColor, theme)

    canvas.width = sourceCanvas.width
    canvas.height = sourceCanvas.height
    loadTextureFromCanvas(ctx.gl, ctx.tex, sourceCanvas)

    const { mode, border } = PRESETS.default
    pxRef.current = FROM_PIXELS
    glRender(ctx.gl, ctx.prog, canvas, FROM_PIXELS, mode, border)
    overlay.style.opacity = '1'

    let last = null

    function step(ts) {
      if (!last) last = ts
      const dt = (ts - last) / 1000
      last = ts

      pxRef.current = Math.max(1, pxRef.current - SPEED * dt)
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border)

      const px = pxRef.current
      const opacity = px > FADE_START ? 1 : px <= 1 ? 0 : (px - 1) / (FADE_START - 1)
      overlay.style.opacity = String(opacity)

      if (px > 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [screenRef, wallpaperColor, theme, onComplete])

  return (
    <div ref={overlayRef} className="desktop-boot-reveal">
      <canvas ref={canvasRef} className="desktop-boot-reveal__canvas" />
    </div>
  )
}
