import { useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { initGL, glRender, loadTextureFromCanvas, PRESETS } from '../pixel-engine/hooks/glEngine'
import './DesktopBootReveal.css'

const FROM_PIXELS = 72
const DURATION = 1.05
const RGB_SPLIT_ABOVE = 26
const TEXTURE_SWAP_ABOVE = 30

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function createFallbackCanvas(width, height, wallpaperColor, theme) {
  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(26,26,24,0.07)'
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1
  for (let x = 0; x <= width; x += 24) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += 24) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  return canvas
}

function pickPreset(pixels) {
  if (pixels > RGB_SPLIT_ABOVE) return PRESETS.rgb_split
  if (pixels > 8) return PRESETS.mosaic
  return PRESETS.default
}

export default function DesktopBootReveal({ contentRef, wallpaperColor, theme, onComplete }) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const glRef = useRef(null)
  const rafRef = useRef(null)
  const pxRef = useRef(FROM_PIXELS)
  const capturedRef = useRef(null)
  const textureSwappedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const content = contentRef.current
    const overlay = overlayRef.current
    if (!canvas || !content || !overlay) return

    let cancelled = false

    const rect = content.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))

    const ctx = initGL(canvas)
    if (!ctx) {
      onComplete?.()
      return
    }
    glRef.current = ctx

    const fallback = createFallbackCanvas(width, height, wallpaperColor, theme)
    canvas.width = fallback.width
    canvas.height = fallback.height
    loadTextureFromCanvas(ctx.gl, ctx.tex, fallback)

    pxRef.current = FROM_PIXELS
    const initial = pickPreset(FROM_PIXELS)
    glRender(ctx.gl, ctx.prog, canvas, FROM_PIXELS, initial.mode, initial.border)
    overlay.style.opacity = '1'

    const trySwapTexture = () => {
      if (textureSwappedRef.current || cancelled || !capturedRef.current || pxRef.current <= TEXTURE_SWAP_ABOVE) return
      textureSwappedRef.current = true
      loadTextureFromCanvas(ctx.gl, ctx.tex, capturedRef.current)
      const preset = pickPreset(pxRef.current)
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, preset.mode, preset.border)
    }

    toCanvas(content, {
      pixelRatio: dpr,
      width,
      height,
      skipFonts: true,
      cacheBust: true,
      filter: (node) => !node.classList?.contains('desktop-boot-reveal'),
    })
      .then((captured) => {
        if (cancelled) return
        capturedRef.current = captured
        trySwapTexture()
      })
      .catch(() => {})

    let startTime = null

    function step(ts) {
      if (cancelled) return
      if (!startTime) startTime = ts

      const t = Math.min(1, (ts - startTime) / (DURATION * 1000))
      pxRef.current = FROM_PIXELS + (1 - FROM_PIXELS) * easeOutCubic(t)

      trySwapTexture()

      const preset = pickPreset(pxRef.current)
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, preset.mode, preset.border)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [contentRef, wallpaperColor, theme, onComplete])

  return (
    <div ref={overlayRef} className="desktop-boot-reveal">
      <canvas ref={canvasRef} className="desktop-boot-reveal__canvas" />
    </div>
  )
}
