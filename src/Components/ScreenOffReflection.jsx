import { useEffect, useRef, useState } from 'react'
import './ScreenOffReflection.css'

/**
 * Glossy powered-off panel: black glass + optional webcam reflection.
 */
export default function ScreenOffReflection() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [hasCamera, setHasCamera] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play().catch(() => {})
        }
        setHasCamera(true)
      } catch {
        if (!cancelled) setHasCamera(false)
      }
    }

    startCamera()

    const video = videoRef.current

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      if (video) video.srcObject = null
    }
  }, [])

  return (
    <div className="screen-off" aria-hidden>
      <div className="screen-off__glass" />
      <video
        ref={videoRef}
        className={`screen-off__camera${hasCamera ? ' screen-off__camera--visible' : ''}`}
        playsInline
        muted
        autoPlay
      />
      <div className="screen-off__tint" />
      <div className="screen-off__sheen" />
      <div className="screen-off__grain" />
      <div className="screen-off__scan" />
    </div>
  )
}
