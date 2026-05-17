let audioCtx = null

/** Короткий «тик» в духе TE — Web Audio, без файлов */
export function playUiClick() {
  if (typeof window === 'undefined') return

  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      audioCtx = new Ctx()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const t0 = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, t0)
    osc.frequency.exponentialRampToValueAtTime(600, t0 + 0.04)

    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05)

    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.055)
  } catch {
    /* ignore — autoplay policy */
  }
}

export function playUiOpen() {
  playUiClick()
  if (!audioCtx) return
  try {
    const t0 = audioCtx.currentTime + 0.06
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, t0)
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.085)
  } catch {
    /* ignore */
  }
}
