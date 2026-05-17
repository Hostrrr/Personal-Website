import { useEffect, useRef, useCallback, useState } from "react";
import { initGL, glRender, loadTexture, PRESETS } from "./glEngine";

/**
 * usePixelReveal
 *
 * Хук для эффекта депикселизации при появлении элемента в viewport.
 * Возвращает canvasRef — вешаешь на <canvas>.
 *
 * @param {string} src         - URL картинки
 * @param {object} options
 *   @param {string}  preset     - "default" | "mosaic" | "rgb_split" | "blur"
 *   @param {number}  fromPixels - начальный размер пикселя (default: 48)
 *   @param {number}  speed      - скорость анимации px/s (default: 80)
 *   @param {number}  threshold  - intersection threshold 0..1 (default: 0.15)
 *   @param {boolean} replay     - повторять анимацию каждый раз при появлении
 *   @param {boolean} hoverPause - при наведении останавливать на 1px
 *   @param {boolean} observe      - запуск через IntersectionObserver (default: true)
 */
export function usePixelReveal(src, options = {}) {
  const {
    preset     = "default",
    fromPixels = 48,
    speed      = 80,
    threshold  = 0.15,
    replay     = false,
    hoverPause = false,
    observe    = true,
  } = options;

  const [isReady, setIsReady] = useState(false);

  const canvasRef   = useRef(null);
  const glRef       = useRef(null);
  const rafRef      = useRef(null);
  const observerRef = useRef(null);
  const pxRef            = useRef(fromPixels);
  const doneRef          = useRef(false);
  const animatingRef     = useRef(false);
  const readyRef         = useRef(false);
  const pendingRevealRef = useRef(false);
  const startRevealRef   = useRef(null);

  const fitCanvasToImage = useCallback((canvas, img, maxDim = 1200) => {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (!w || !h) return;
    const scale = Math.min(1, maxDim / Math.max(w, h));
    canvas.width  = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
  }, []);

  // WebGL — один раз на монтирование
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = initGL(canvas);
    if (!ctx) return;
    glRef.current = ctx;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      glRef.current = null;
    };
  }, []);

  // Загрузка текстуры при смене src
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = glRef.current;
    if (!canvas || !ctx || !src) return;

    doneRef.current = false;
    animatingRef.current = false;
    readyRef.current = false;
    pendingRevealRef.current = false;
    pxRef.current = fromPixels;
    setIsReady(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const { mode, border } = PRESETS[preset] ?? PRESETS.default;
    let cancelled = false;

    loadTexture(ctx.gl, ctx.tex, src).then((img) => {
      if (cancelled) return;
      fitCanvasToImage(canvas, img);
      glRender(ctx.gl, ctx.prog, canvas, fromPixels, mode, border);
      readyRef.current = true;
      setIsReady(true);
      pendingRevealRef.current = false;
      if (!observe) {
        startRevealRef.current?.();
      }
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src, preset, fromPixels, fitCanvasToImage, observe]);

  // Функция анимации: от текущего pxRef → 1
  const startReveal = useCallback(() => {
    if (!readyRef.current) {
      pendingRevealRef.current = true;
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pxRef.current = fromPixels;
    doneRef.current = false;
    animatingRef.current = true;
    let last = null;
    const ctx = glRef.current;
    if (!ctx) return;
    const { mode, border } = PRESETS[preset] ?? PRESETS.default;
    const canvas = canvasRef.current;

    function step(ts) {
      if (!last) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      pxRef.current = Math.max(1, pxRef.current - speed * dt);
      glRender(ctx.gl, ctx.prog, canvas, pxRef.current, mode, border);
      if (pxRef.current > 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
        doneRef.current = true;
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }, [preset, fromPixels, speed]);

  startRevealRef.current = startReveal;

  const stopObserving = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  // IntersectionObserver — запускаем при появлении
  useEffect(() => {
    if (!observe) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (doneRef.current && !replay) return;
        startReveal();
        if (!replay) stopObserving();
      },
      { threshold }
    );

    observer.observe(canvas);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [observe, startReveal, threshold, replay, stopObserving]);

  // Hover-пауза: только устройства с мышью; не прерывать идущую анимацию
  useEffect(() => {
    if (!hoverPause) return;
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const snapSharp = () => {
      const ctx = glRef.current;
      if (!ctx) return;
      const { mode, border } = PRESETS[preset] ?? PRESETS.default;
      pxRef.current = 1;
      glRender(ctx.gl, ctx.prog, canvas, 1, mode, border);
    };

    const onEnter = () => {
      if (animatingRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      snapSharp();
    };

    const onLeave = () => {
      if (animatingRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      animatingRef.current = false;
      doneRef.current = true;
      snapSharp();
    };

    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [hoverPause, preset]);

  // Публичный метод для ручного триггера
  const trigger = useCallback(() => {
    doneRef.current = false;
    startReveal();
  }, [startReveal]);

  return { canvasRef, trigger, isReady };
}
