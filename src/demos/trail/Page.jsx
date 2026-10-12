import { useEffect, useRef, useState } from 'react'
import usePageFont from '../usePageFont'
import usePrefersReducedMotion from '../usePrefersReducedMotion'
import './page.css'

const STOPS = [
  { km: '0.0', name: 'старт', note: 'двор на Кирочной, фонарь у арки', weight: '' },
  { km: '1.4', name: 'куртка «сухой ход»', note: 'мембрана, капюшон прячется в ворот', weight: '380 г' },
  { km: '4.8', name: 'рюкзак 28', note: 'пояс, карман фляги на лямке', weight: '910 г' },
  { km: '7.2', name: 'фляга 0.6', note: 'сталь, не гремит о карабин', weight: '120 г' },
  { km: '11.0', name: 'ботинок «кора»', note: 'пара, подошва держит мокрый корень', weight: '640 г' },
  { km: '14.6', name: 'финиш', note: 'мост, 21:40, набор 2.05 кг', weight: '2.05 кг' },
]

const SEGMENTS = [
  'M48 0 L18 100',
  'M18 0 L62 100',
  'M62 0 L24 100',
  'M24 0 L70 100',
  'M70 0 L30 100',
  'M30 0 L48 100',
]

export default function TrailPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Russo+One&display=swap',
  )
  const reduced = usePrefersReducedMotion()
  const stopsRef = useRef(null)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const root = stopsRef.current
    if (!root) return undefined
    const nodes = [...root.querySelectorAll('.tr-stop')]
    if (reduced) {
      nodes.forEach((node) => node.classList.add('is-drawn'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-drawn')
      })
    }, { threshold: 0.55 })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [reduced])

  function onPointerMove(event) {
    if (reduced || window.innerWidth < 800) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - rect.left) / rect.width - 0.5
    setAngle(dx * 16)
  }

  return (
    <main className="tr">
      <header className="tr-hero" onPointerMove={onPointerMove} onPointerLeave={() => setAngle(0)}>
        <div>
          <p>маршрут 07 · ночь</p>
          <h1>Тропа</h1>
          <p className="tr-length">14.6 км</p>
        </div>
        <svg
          className="tr-compass"
          viewBox="0 0 80 80"
          aria-hidden="true"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <circle cx="40" cy="40" r="30" />
          <path d="M40 12 L46 40 L40 34 L34 40 Z" />
          <path d="M40 68 L34 40 L40 46 L46 40 Z" />
          <text x="36" y="22">N</text>
        </svg>
      </header>

      <ol className="tr-stops" ref={stopsRef}>
        {STOPS.map((stop, index) => (
          <li key={stop.km} className="tr-stop">
            <svg className="tr-seg" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true">
              <path d={SEGMENTS[index]} />
            </svg>
            <span className="tr-km">{stop.km}</span>
            <span className="tr-node" />
            <div className="tr-body">
              <h2>{stop.name}</h2>
              <p>{stop.note}</p>
              {stop.weight ? <b>{stop.weight}</b> : null}
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
