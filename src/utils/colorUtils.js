/**
 * Converts a hex color to a darker, more saturated version.
 * Used for dark theme window backgrounds.
 */
export function darkenAndSaturate(hex, lightnessMultiplier = 0.25) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex
  const clean = hex.slice(1)
  if (clean.length !== 6) return hex
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        break
    }
    h /= 6
  }

  const targetL = Math.max(0, l * lightnessMultiplier)
  const targetS = Math.min(1, s * 1.3 || 0.35)

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let nr, ng, nb

  if (targetS === 0) {
    nr = ng = nb = targetL
  } else {
    const q = targetL < 0.5 ? targetL * (1 + targetS) : targetL + targetS - targetL * targetS
    const p = 2 * targetL - q
    nr = hue2rgb(p, q, h + 1 / 3)
    ng = hue2rgb(p, q, h)
    nb = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (v) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v * 255)))
    return clamped.toString(16).padStart(2, '0')
  }

  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`
}
