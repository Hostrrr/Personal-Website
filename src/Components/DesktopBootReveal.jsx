import { useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { initGL, glRender, PRESETS } from '../pixel-engine/hooks/glEngine'
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

export default function DesktopBootReveal({
  contentRef,
  wallpaperColor,
  theme,
  onComplete,
  canReveal,
}) {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const rafRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const canRevealRef = useRef(canReveal)
  const glCtxRef = useRef(null)
  const preparedRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    canRevealRef.current = canReveal
  }, [canReveal])

  const startAnimation = () => {
    if (startedRef.current || !preparedRef.current || !glCtxRef.current) return
    if (!canRevealRef.current) return

    const canvas = canvasRef.current
    const overlay = overlayRef.current
    const glCtx = glCtxRef.current
    if (!canvas || !overlay) return

    startedRef.current = true

    const { mode, border } = PRESETS.default
    let px = FROM_PIXELS

    glRender(glCtx.gl, glCtx.prog, canvas, px, mode, border, glCtx.uniforms)
    overlay.style.opacity = '1'

    let last = null

    function step(ts) {
      if (!last) last = ts
      const dt = (ts - last) / 1000
      last = ts

      px = Math.max(1, px - SPEED * dt)
      glRender(glCtx.gl, glCtx.prog, canvas, px, mode, border, glCtx.uniforms)

      if (px > 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        onCompleteRef.current?.()
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    if (canReveal) startAnimation()
  }, [canReveal])

  useEffect(() => {
    const canvas = canvasRef.current
    const content = contentRef.current
    if (!canvas || !content) return

    let cancelled = false

    const prepare = async () => {
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

      canvas.width = sourceCanvas.width
      canvas.height = sourceCanvas.height

      const glCtx = initGL(canvas)
      if (!glCtx) {
        onCompleteRef.current?.()
        return
      }

      glCtx.gl.bindTexture(glCtx.gl.TEXTURE_2D, glCtx.tex)
      glCtx.gl.texImage2D(
        glCtx.gl.TEXTURE_2D, 0, glCtx.gl.RGBA, glCtx.gl.RGBA, glCtx.gl.UNSIGNED_BYTE, sourceCanvas
      )

      glCtxRef.current = glCtx
      preparedRef.current = true

      if (canRevealRef.current) startAnimation()
    }

    prepare()

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [contentRef, wallpaperColor, theme])

  return (
    <div ref={overlayRef} className="desktop-boot-reveal">
      <canvas ref={canvasRef} className="desktop-boot-reveal__canvas" />
    </div>
  )
}
