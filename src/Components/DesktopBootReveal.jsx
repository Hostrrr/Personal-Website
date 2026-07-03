import { useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { initGL, glRender, loadTextureFromCanvas, PRESETS } from '../pixel-engine/hooks/glEngine'
import './DesktopBootReveal.css'

const FROM_PIXELS = 48
const SPEED = 62

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

  return canvas
}

export default function DesktopBootReveal({ contentRef, wallpaperColor, theme, onComplete }) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const glRef = useRef(null)
  const rafRef = useRef(null)
  const pxRef = useRef(FROM_PIXELS)

  useEffect(() => {
    const canvas = canvasRef.current
    const content = contentRef.current
    const overlay = overlayRef.current
    if (!canvas || !content || !overlay) return

    let cancelled = false

    const run = async () => {
      await new Promise((r) => requestAnimationFrame(r))
      if (cancelled) return

      const rect = content.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      let sourceCanvas
      try {
        sourceCanvas = await toCanvas(content, {
          pixelRatio: dpr,
          width,
          height,
          cacheBust: true,
          filter: (node) => !node.classList?.contains('desktop-boot-reveal'),
        })
      } catch {
        sourceCanvas = createFallbackCanvas(width, height, wallpaperColor, theme)
      }

      if (cancelled) return

      const ctx = initGL(canvas)
      if (!ctx) {
        onComplete?.()
        return
      }
      glRef.current = ctx

      canvas.width = sourceCanvas.width
      canvas.height = sourceCanvas.height
      loadTextureFromCanvas(ctx.gl, ctx.tex, sourceCanvas)

      const { mode, border } = PRESETS.default
      pxRef.current = FROM_PIXELS
      glRender(ctx.gl, ctx.prog, canvas, FROM_PIXELS, mode, border)
      overlay.style.opacity = '1'

      let last = null

      function step(ts) {
        if (cancelled) return
        if (!last) last = ts
        const dt = (ts - last) / 1000
        last = ts

        pxRef.current = Math.max(1, pxRef.current - SPEED * dt)
        glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border)

        if (pxRef.current > 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          onComplete?.()
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    run()

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
