import { useEffect, useRef } from "react";
import { initGL, glRender, loadTexture, PRESETS } from "../hooks/glEngine";

/**
 * PixelBackground — растягивает шейдер на весь контейнер, children поверх.
 * Удобно для фона окна/секции.
 *
 * Использование:
 *   <PixelBackground src="/wallpaper.jpg" preset="mosaic" fromPixels={32}>
 *     <div>контент поверх фона</div>
 *   </PixelBackground>
 */
export function PixelBackground({
  src,
  preset = "default",
  fromPixels = 48,
  speed = 60,
  autoPlay = true,
  children,
  style,
  className,
}) {
  const canvasRef = useRef(null);
  const glRef     = useRef(null);
  const rafRef    = useRef(null);
  const pxRef     = useRef(fromPixels);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;

    const ctx = initGL(canvas);
    if (!ctx) return;
    glRef.current = ctx;

    const { mode, border } = PRESETS[preset] ?? PRESETS.default;

    loadTexture(ctx.gl, ctx.tex, src).then(() => {
      glRender(ctx.gl, ctx.prog, canvas, fromPixels, mode, border);
      if (autoPlay) startReveal();
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src, preset]);

  function startReveal() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pxRef.current = fromPixels;
    let last = null;
    const ctx = glRef.current;
    const canvas = canvasRef.current;
    const { mode, border } = PRESETS[preset] ?? PRESETS.default;

    function step(ts) {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      pxRef.current = Math.max(1, pxRef.current - speed * dt);
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border);
      if (pxRef.current > 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
  }

  // Подгоняем размер канваса под контейнер
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width  = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = glRef.current;
      if (ctx) {
        const { mode, border } = PRESETS[preset] ?? PRESETS.default;
        glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border);
      }
    });
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [preset]);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}
         className={className}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
