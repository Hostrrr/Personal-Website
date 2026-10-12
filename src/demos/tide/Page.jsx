import { useEffect, useRef } from 'react'
import usePageFont from '../usePageFont'
import usePrefersReducedMotion from '../usePrefersReducedMotion'
import './page.css'

const MARKS = [
  { time: '07:10', name: 'тихая вода', level: '0.4 м', x: 8, y: 62 },
  { time: '09:40', name: 'длинный выдох', level: '1.1 м', x: 22, y: 30, next: true },
  { time: '12:15', name: 'открытое окно', level: '0.7 м', x: 43, y: 74 },
  { time: '16:00', name: 'соль', level: '1.8 м', x: 64, y: 20 },
  { time: '19:30', name: 'ночной прилив', level: '1.3 м', x: 86, y: 50 },
]

const WAVE = 'M0 150 C 90 150 130 78 210 86 S 340 196 430 168 S 560 36 650 52 S 790 196 900 132 S 980 78 1000 96'

export default function TidePage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;1,8..60,480&display=swap',
  )
  const reduced = usePrefersReducedMotion()
  const boardRef = useRef(null)

  useEffect(() => {
    const board = boardRef.current
    if (!board || reduced) {
      board?.style.removeProperty('--tide-shift')
      return undefined
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const shift = Math.min(26, window.scrollY * 0.06)
        board.style.setProperty('--tide-shift', `${shift}px`)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <main className="td">
      <header className="td-hero">
        <div>
          <p className="td-kicker">студия движения</p>
          <h1>Прилив</h1>
        </div>
        <div className="td-gauge" aria-label="Следующее занятие, уровень 1.1 метра">
          <span className="td-gauge-label">след.</span>
          <strong>09:40</strong>
          <i aria-hidden="true"><b /></i>
          <em>1.1 м</em>
          <span>длинный выдох</span>
        </div>
      </header>

      <section className="td-board" ref={boardRef} aria-label="График дня">
        <svg className="td-wave" viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true">
          <path className="td-fill" d={`${WAVE} L1000 240 L0 240 Z`} />
          <path className="td-line" pathLength="1" d={WAVE} />
        </svg>
        <p className="td-under">уровень дня</p>
        {MARKS.map((mark) => (
          <p
            key={mark.time}
            className={mark.next ? 'td-mark is-next' : 'td-mark'}
            style={{ '--x': `${mark.x}%`, '--y': `${mark.y}%` }}
          >
            <span>{mark.time}</span>
            <em>{mark.name}</em>
            <small>{mark.level}</small>
          </p>
        ))}
      </section>

      <ol className="td-column">
        {MARKS.map((mark) => (
          <li key={mark.time} className={mark.next ? 'is-next' : ''}>
            <span>{mark.time}</span>
            <strong>{mark.name}</strong>
            <small>{mark.level}</small>
          </li>
        ))}
      </ol>

      <footer className="td-foot">
        <p>зал у воды · Кадетская линия, 5</p>
        <p>коврик свой · дверь с набережной</p>
      </footer>
    </main>
  )
}
