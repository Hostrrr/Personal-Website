import { useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { initGL, glRender, loadTextureFromCanvas, PRESETS } from '../pixel-engine/hooks/glEngine'
import './DesktopBootReveal.css'

const FROM_PIXELS = 48
const SPEED = 62

const waitFrame = () => new Promise((resolve) => {
  requestAnimationFrame(() => resolve())
})

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

  return canvas
}

async function uploadTexture(gl, tex, sourceCanvas) {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(sourceCanvas)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap)
    bitmap.close()
    return
  }

  loadTextureFromCanvas(gl, tex, sourceCanvas)
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

    const glCtx = initGL(canvas)
    if (!glCtx) {
      onComplete?.()
      return
    }
    glRef.current = glCtx

    const run = async () => {
      await waitFrame()
      if (cancelled) return

      const rect = content.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      let sourceCanvas
      try {
        sourceCanvas = await toCanvas(content, {
          pixelRatio: dpr,
          width,
          height,
          cacheBust: true,
          skipFonts: true,
          filter: (node) => !node.classList?.contains('desktop-boot-reveal'),
        })
      } catch {
        sourceCanvas = createFallbackCanvas(width, height, wallpaperColor, theme)
      }

      if (cancelled) return

      await waitFrame()
      if (cancelled) return

      canvas.width = sourceCanvas.width
      canvas.height = sourceCanvas.height

      await waitFrame()
      if (cancelled) return

      await uploadTexture(glCtx.gl, glCtx.tex, sourceCanvas)

      const { mode, border } = PRESETS.default
      pxRef.current = FROM_PIXELS
      glRender(glCtx.gl, glCtx.prog, canvas, FROM_PIXELS, mode, border, glCtx.uniforms)

      await waitFrame()
      if (cancelled) return

      overlay.style.opacity = '1'

      let last = null

      function step(ts) {
        if (cancelled) return
        if (!last) last = ts
        const dt = Math.min(0.05, (ts - last) / 1000)
        last = ts

        pxRef.current = Math.max(1, pxRef.current - SPEED * dt)
        glRender(glCtx.gl, glCtx.prog, canvas, pxRef.current, mode, border, glCtx.uniforms)

        if (pxRef.current > 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          onComplete?.()
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    if (typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(() => run(), { timeout: 150 })
      return () => {
        cancelled = true
        cancelIdleCallback(idleId)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
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
