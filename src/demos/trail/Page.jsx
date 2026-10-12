import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import usePageFont from '../usePageFont'
import usePrefersReducedMotion from '../usePrefersReducedMotion'
import { GEAR, PROMISES, ROUTE_KM, SEASONS, elevationAt } from './data'
import './page.css'

const SEGMENTS = [
  'M48 0 L18 100',
  'M18 0 L62 100',
  'M62 0 L24 100',
  'M24 0 L70 100',
  'M70 0 L30 100',
  'M30 0 L48 100',
  'M48 0 L24 100',
]

const LOW = 280
const HIGH = 1060

function profileY(meters) {
  return 74 - ((meters - LOW) / (HIGH - LOW)) * 62
}

function buildProfile() {
  const points = []
  for (let i = 0; i <= 120; i += 1) {
    const km = (i / 120) * ROUTE_KM
    points.push(`${((km / ROUTE_KM) * 1000).toFixed(1)} ${profileY(elevationAt(km)).toFixed(1)}`)
  }
  return points
}

const PROFILE = buildProfile()
const LINE = `M${PROFILE.join(' L')}`
const AREA = `${LINE} L1000 80 L0 80 Z`

function kg(grams) {
  return (grams / 1000).toFixed(2).replace('.', ',')
}

function rub(value) {
  return `${value.toLocaleString('ru-RU')} ₽`
}

function weightClass(grams) {
  if (grams === 0) return 'пусто'
  if (grams < 2000) return 'сверхлёгкий'
  if (grams < 3500) return 'лёгкий'
  return 'походный'
}

export default function TrailPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Russo+One&display=swap',
  )
  const reduced = usePrefersReducedMotion()
  const stopsRef = useRef(null)
  const [angle, setAngle] = useState(0)
  const [progress, setProgress] = useState(0)
  const [season, setSeason] = useState('autumn')
  const [pack, setPack] = useState({ jacket: true, pack: true, bottle: true })
  const [open, setOpen] = useState(null)
  const [ordered, setOrdered] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

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
    }, { threshold: 0.4 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [reduced])

  const currentSeason = SEASONS.find((item) => item.id === season)
  const km = progress * ROUTE_KM
  const meters = elevationAt(km)

  const chosen = GEAR.filter((item) => pack[item.id])
  const grams = chosen.reduce((sum, item) => sum + item.weight, 0)
  const total = chosen.reduce((sum, item) => sum + item.price, 0)

  function onPointerMove(event) {
    if (reduced || window.innerWidth < 800) return
    const rect = event.currentTarget.getBoundingClientRect()
    setAngle(((event.clientX - rect.left) / rect.width - 0.5) * 18)
  }

  function togglePack(id) {
    setPack((current) => ({ ...current, [id]: !current[id] }))
    setOrdered(false)
  }

  function subscribe(event) {
    event.preventDefault()
    if (email.includes('@')) setSubscribed(true)
  }

  return (
    <main className="tr">
      <nav className="tr-nav" aria-label="Разделы">
        <a className="tr-logo" href="#top">Тропа</a>
        <div>
          <a href="#conditions">условия</a>
          <a href="#route">точки</a>
          <a href="#pack">рюкзак</a>
          <a href="#service">сервис</a>
        </div>
      </nav>

      <header className="tr-hero" id="top" onPointerMove={onPointerMove} onPointerLeave={() => setAngle(0)}>
        <div>
          <p>маршрут 07 · ночь · снаряжение</p>
          <h1>Тропа</h1>
          <p className="tr-length">14.6 км</p>
          <p className="tr-lead">Снаряжение для ночных маршрутов. Каждая вещь — точка на карте, у каждой есть километр и вес.</p>
          <a className="tr-cta" href="#route">к первой точке ↓</a>
        </div>
        <svg className="tr-compass" viewBox="0 0 80 80" aria-hidden="true" style={{ transform: `rotate(${angle}deg)` }}>
          <circle cx="40" cy="40" r="30" />
          <path d="M40 12 L46 40 L40 34 L34 40 Z" />
          <path d="M40 68 L34 40 L40 46 L46 40 Z" />
          <text x="36" y="22">N</text>
        </svg>
      </header>

      <section className="tr-cond" id="conditions" aria-label="Условия на маршруте">
        <div className="tr-seasons" role="tablist" aria-label="Сезон">
          {SEASONS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === season} onClick={() => setSeason(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
        <dl>
          <div><dt>ночью</dt><dd>{currentSeason.temp}</dd></div>
          <div><dt>ветер</dt><dd>{currentSeason.wind}</dd></div>
          <div><dt>осадки</dt><dd>{currentSeason.rain}</dd></div>
          <div><dt>светлый день</dt><dd>{currentSeason.light}</dd></div>
        </dl>
        <p className="tr-tip">{currentSeason.tip}</p>
      </section>

      <ol className="tr-stops" id="route" ref={stopsRef}>
        <li className="tr-stop is-start">
          <svg className="tr-seg" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true"><path d={SEGMENTS[0]} /></svg>
          <span className="tr-km">0.0</span>
          <span className="tr-node" />
          <div className="tr-body">
            <h2>старт</h2>
            <p>двор на Кирочной, фонарь у арки. Здесь собираем рюкзак и проверяем лампу.</p>
          </div>
        </li>

        {GEAR.map((item, index) => {
          const inPack = Boolean(pack[item.id])
          const fits = item.seasons.includes(season)
          return (
            <li key={item.id} className="tr-stop">
              <svg className="tr-seg" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true"><path d={SEGMENTS[(index + 1) % SEGMENTS.length]} /></svg>
              <span className="tr-km">{item.km.toFixed(1)}</span>
              <span className="tr-node" />
              <div className="tr-body">
                <h2>{item.name}</h2>
                <p>{item.note}</p>
                <p className="tr-meta">
                  <b>{item.weight} г</b>
                  <span>{rub(item.price)}</span>
                  <span>{Math.round(elevationAt(item.km))} м над морем</span>
                  {fits ? <em>для сезона: {currentSeason.name}</em> : null}
                </p>
                <div className="tr-acts">
                  <button type="button" className={inPack ? 'is-on' : ''} aria-pressed={inPack} onClick={() => togglePack(item.id)}>
                    {inPack ? 'в рюкзаке' : 'в рюкзак'}
                  </button>
                  <button type="button" className="tr-more" aria-expanded={open === item.id} onClick={() => setOpen(open === item.id ? null : item.id)}>
                    характеристики
                  </button>
                </div>
                {open === item.id ? (
                  <ul className="tr-specs">
                    {item.specs.map((spec) => <li key={spec}>{spec}</li>)}
                  </ul>
                ) : null}
              </div>
            </li>
          )
        })}

        <li className="tr-stop is-finish" id="pack">
          <svg className="tr-seg" viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true"><path d={SEGMENTS[0]} /></svg>
          <span className="tr-km">14.6</span>
          <span className="tr-node" />
          <div className="tr-body">
            <h2>финиш — ваш набор</h2>
            <p>мост, 21:40. Сколько вы несёте — столько и прошли.</p>

            <div className="tr-pack">
              <div className="tr-weight">
                <b>{kg(grams)}</b><span>кг · {weightClass(grams)}</span>
              </div>
              <div className="tr-stack" aria-hidden="true">
                {chosen.map((item) => <i key={item.id} style={{ flexGrow: item.weight }} title={item.name}><span>{item.name.split(' ')[0]}</span></i>)}
              </div>
              <ul className="tr-list">
                {chosen.length ? chosen.map((item) => (
                  <li key={item.id}><span>{item.name}</span><i aria-hidden="true" /><span>{item.weight} г</span></li>
                )) : <li className="tr-empty">рюкзак пуст. Вернитесь по маршруту и отметьте вещи.</li>}
              </ul>
              <p className="tr-sum"><span>итого</span><b>{rub(total)}</b></p>
              <button type="button" className="tr-order" disabled={!chosen.length} onClick={() => setOrdered(true)}>
                {ordered ? 'набор отложен, мы позвоним' : 'оформить набор'}
              </button>
            </div>
          </div>
        </li>
      </ol>

      <section className="tr-service" id="service">
        <p className="tr-sec-kicker">за финишем · 15.0</p>
        <h2>Сделано, чтобы чинить</h2>
        <ul>
          {PROMISES.map(([big, title, text]) => (
            <li key={title}>
              <b>{big}</b>
              <strong>{title}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="tr-brief">
        <h2>Сводка маршрута</h2>
        <p>Раз в месяц одно письмо: новые маршруты, погода на выходные и скидки на прошлый сезон.</p>
        {subscribed ? (
          <p className="tr-ok" role="status">записали {email}. Первое письмо придёт в пятницу.</p>
        ) : (
          <form onSubmit={subscribe}>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ваш e-mail" aria-label="E-mail" />
            <button type="submit">подписаться</button>
          </form>
        )}
      </section>

      <footer className="tr-foot">
        <p>мастерская и склад: Кирочная ул., 40 · вт–вс 12:00–20:00</p>
        <Link to="/">← портфолио</Link>
      </footer>

      <div className="tr-profile" role="img" aria-label={`Профиль высоты: ${km.toFixed(1)} км, ${Math.round(meters)} м`}>
        <p className="tr-prof-info"><b>{km.toFixed(1)}</b> км<span>{Math.round(meters)} м</span></p>
        <div className="tr-prof-chart">
          <svg viewBox="0 0 1000 80" preserveAspectRatio="none"><path className="tr-prof-line" d={LINE} /></svg>
          <svg className="tr-prof-done" viewBox="0 0 1000 80" preserveAspectRatio="none" style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}>
            <path className="tr-prof-fill" d={AREA} />
          </svg>
          {GEAR.map((item) => (
            <i
              key={item.id}
              className={`tr-prof-tick${pack[item.id] ? ' is-in' : ''}`}
              style={{ left: `${(item.km / ROUTE_KM) * 100}%`, top: `${(profileY(elevationAt(item.km)) / 80) * 100}%` }}
            />
          ))}
          <i className="tr-prof-dot" style={{ left: `${progress * 100}%`, top: `${(profileY(meters) / 80) * 100}%` }} />
        </div>
        <p className="tr-prof-pack">{kg(grams)} кг<span>{chosen.length} из {GEAR.length}</span></p>
      </div>
    </main>
  )
}
