import { usePixelReveal } from "../hooks/usePixelReveal";

/**
 * PixelImage — дроп-ин замена для <img> с эффектом депикселизации.
 */
export function PixelImage({
  src,
  alt = "",
  preset = "default",
  fromPixels = 48,
  speed = 80,
  threshold = 0.15,
  replay = false,
  hoverPause = false,
  observe = true,
  width,
  height,
  style,
  className,
}) {
  const { canvasRef, isReady } = usePixelReveal(src, {
    preset,
    fromPixels,
    speed,
    threshold,
    replay,
    hoverPause,
    observe,
  });

  const hasDisplaySize = width != null && height != null;

  return (
    <canvas
      ref={canvasRef}
      width={width ?? 2}
      height={height ?? 2}
      aria-label={alt}
      role="img"
      className={[
        className,
        isReady ? "pixel-image--ready" : "pixel-image--loading",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        display: "block",
        width: hasDisplaySize ? `${width}px` : "100%",
        height: hasDisplaySize ? `${height}px` : "100%",
        ...style,
      }}
    />
  );
}
