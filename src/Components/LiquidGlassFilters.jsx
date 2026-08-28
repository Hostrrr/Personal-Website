/** SVG refraction for Apple Liquid Glass (Chromium backdrop-filter). */
export default function LiquidGlassFilters() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
      <filter id="lg-refract" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.016" numOctaves="2" seed="7" result="n" />
        <feGaussianBlur in="n" stdDeviation="1.1" result="s" />
        <feDisplacementMap in="SourceGraphic" in2="s" scale="22" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
