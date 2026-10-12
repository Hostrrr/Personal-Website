import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageFont from '../usePageFont'
import useInView from '../useInView'
import useMinute, { localParts } from '../useMinute'
import { DAYS, FACTS, PASSES, PRACTICES, TEACHERS } from './data'
import './page.css'

const START = 7 * 60
const END = 21 * 60

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function rub(value) {
  return `${value.toLocaleString('ru-RU')} ₽`
}

function point(item) {
  const x = 60 + ((toMinutes(item.time) - START) / (END - START)) * 880
  const y = 230 - (item.level / 2) * 170
  return { x, y }
}

function smooth(points) {
  if (points.length < 2) return ''
  let path = `M${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    path += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return path
}

function signature(amp, periods) {
  const segments = periods * 4
  const width = 400 / segments
  let path = 'M0 24'
  for (let i = 0; i < segments; i += 1) {
    const control = 24 + (i % 2 === 0 ? -amp * 2 : amp * 2)
    path += ` Q${(i * width + width / 2).toFixed(2)} ${control} ${((i + 1) * width).toFixed(2)} 24`
  }
  return path
}

function PracticeRow({ item, active, onPick }) {
  return (
    <li className={active ? 'is-on' : ''}>
      <button type="button" onClick={onPick} aria-pressed={active}>
        <span className="td-p-level">{item.level.toFixed(1)} м</span>
        <span className="td-p-name">{item.name}</span>
        <span className="td-p-kind">{item.kind}</span>
        <svg className="td-sig" viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true">
          <g className="td-sig-move" style={{ animationDuration: `${item.seconds}s` }}>
            <path d={signature(item.amp, item.periods)} />
          </g>
        </svg>
      </button>
      {active ? <p className="td-p-text">{item.text}</p> : null}
    </li>
  )
}

export default function TidePage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;1,8..60,480&display=swap',
  )

  const minute = useMinute()
  const { day: weekday, minutes: nowMin } = localParts(minute)
  const todayIndex = (weekday + 6) % 7

  const [pickedDay, setPickedDay] = useState(null)
  const [pickedTime, setPickedTime] = useState(null)
  const [booked, setBooked] = useState({})
  const [practiceId, setPracticeId] = useState('exhale')
  const [passId, setPassId] = useState('eight')
  const [trial, setTrial] = useState({ name: '', phone: '', practice: 'exhale' })
  const [trialDone, setTrialDone] = useState(false)
  const [passDone, setPassDone] = useState(false)
  const [setPassRef, passSeen] = useInView(0.35)

  const dayIndex = pickedDay ?? todayIndex
  const day = DAYS[dayIndex]
  const selected = day.classes.find((item) => item.time === pickedTime) ?? day.classes[0]
  const key = `${dayIndex}-${selected.time}`
  const spots = Math.max(0, selected.spots - (booked[key] ? 1 : 0))

  const upcoming = DAYS[todayIndex].classes.find((item) => toMinutes(item.time) > nowMin)
  const nextClass = upcoming ?? DAYS[(todayIndex + 1) % 7].classes[0]
  const nextLabel = upcoming ? 'сегодня' : 'завтра'

  const points = day.classes.map(point)
  const edge = { x: 0, y: 232 }
  const edgeEnd = { x: 1000, y: 232 }
  const wave = smooth([edge, ...points, edgeEnd])

  const pass = PASSES.find((item) => item.id === passId)
  const perSession = pass.sessions ? Math.round(pass.price / pass.sessions) : Math.round(pass.price / 20)
  const practice = PRACTICES.find((item) => item.id === practiceId)

  function pickDay(index) {
    setPickedDay(index)
    setPickedTime(null)
  }

  function toggleBooking() {
    if (spots === 0 && !booked[key]) return
    setBooked((current) => ({ ...current, [key]: !current[key] }))
  }

  function submitTrial(event) {
    event.preventDefault()
    if (!trial.name.trim()) return
    setTrialDone(true)
  }

  return (
    <main className="td">
      <nav className="td-nav" aria-label="Разделы">
        <a className="td-logo" href="#top">Прилив</a>
        <div>
          <a href="#schedule">расписание</a>
          <a href="#practices">практики</a>
          <a href="#passes">абонементы</a>
          <a href="#teachers">тренеры</a>
        </div>
        <a className="td-nav-cta" href="#trial">пробное</a>
      </nav>

      <header className="td-hero" id="top">
        <div>
          <p className="td-kicker">студия движения · Кадетская линия, 5</p>
          <h1>Прилив</h1>
          <p className="td-lead">Занятия подчиняются воде: поднимаемся, держим уровень и спокойно отпускаем. Двенадцать мест в зале на набережной.</p>
        </div>
        <div className="td-gauge" aria-label={`Ближайшее занятие ${nextLabel} в ${nextClass.time}`}>
          <span className="td-gauge-label">след. · {nextLabel}</span>
          <strong>{nextClass.time}</strong>
          <i aria-hidden="true"><b style={{ height: `${(nextClass.level / 2) * 100}%` }} /></i>
          <em>{nextClass.level.toFixed(1)} м</em>
          <span>{nextClass.name}</span>
        </div>
      </header>

      <section className="td-schedule" id="schedule">
        <header className="td-sec">
          <p>расписание</p>
          <h2>Уровень дня</h2>
        </header>

        <div className="td-days" role="tablist" aria-label="День недели">
          {DAYS.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={index === dayIndex}
              onClick={() => pickDay(index)}
            >
              {item.key}
              {index === todayIndex ? <small>сегодня</small> : null}
            </button>
          ))}
        </div>

        <div className="td-board">
          <svg className="td-wave" viewBox="0 0 1000 260" preserveAspectRatio="none" key={dayIndex} aria-hidden="true">
            <path className="td-fill" d={`${wave} L1000 260 L0 260 Z`} />
            <path className="td-line" pathLength="1" d={wave} />
          </svg>
          {day.classes.map((item) => {
            const p = point(item)
            const isOn = item.time === selected.time
            return (
              <button
                key={item.time}
                type="button"
                className={`td-mark${isOn ? ' is-on' : ''}`}
                style={{ left: `${p.x / 10}%`, top: `${(p.y / 260) * 100}%` }}
                aria-pressed={isOn}
                onClick={() => setPickedTime(item.time)}
              >
                <span>{item.time}</span>
                <em>{item.name}</em>
                <small>{item.level.toFixed(1)} м</small>
              </button>
            )
          })}
        </div>

        <ol className="td-column" aria-label="Занятия дня">
          {day.classes.map((item) => (
            <li key={item.time}>
              <button type="button" className={item.time === selected.time ? 'is-on' : ''} onClick={() => setPickedTime(item.time)}>
                <span>{item.time}</span>
                <strong>{item.name}</strong>
                <small>{item.level.toFixed(1)} м</small>
              </button>
            </li>
          ))}
        </ol>

        <article className="td-detail" aria-live="polite">
          <div>
            <p className="td-detail-time">{selected.time}</p>
            <h3>{selected.name}</h3>
            <p className="td-detail-meta">{selected.teacher} · {selected.len} мин · уровень {selected.level.toFixed(1)} м</p>
          </div>
          <div className="td-detail-act">
            <p>{booked[key] ? 'вы записаны' : spots > 0 ? `свободно ${spots} из 12 мест` : 'мест нет'}</p>
            <button type="button" onClick={toggleBooking} disabled={spots === 0 && !booked[key]}>
              {booked[key] ? 'отменить запись' : spots > 0 ? 'записаться' : 'лист ожидания'}
            </button>
          </div>
        </article>
      </section>

      <section className="td-practices" id="practices">
        <header className="td-sec">
          <p>практики</p>
          <h2>Четыре уровня воды</h2>
        </header>
        <ol>
          {PRACTICES.map((item) => (
            <PracticeRow key={item.id} item={item} active={item.id === practiceId} onPick={() => setPracticeId(item.id)} />
          ))}
        </ol>
      </section>

      <section className="td-passes" id="passes" ref={setPassRef}>
        <header className="td-sec">
          <p>абонементы</p>
          <h2>Сколько воды набрать</h2>
        </header>
        <div className="td-vessels">
          {PASSES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === passId ? 'is-on' : ''}
              aria-pressed={item.id === passId}
              onClick={() => { setPassId(item.id); setPassDone(false) }}
            >
              <span className="td-tube">
                <i style={{ height: passSeen ? `${item.level * 100}%` : '0%' }} />
              </span>
              <strong>{item.name}</strong>
              <b>{rub(item.price)}</b>
              <small>{item.note}</small>
            </button>
          ))}
        </div>
        <div className="td-pass-sum">
          <p>
            <b>{pass.name}</b> · {pass.sessions ? `${pass.sessions} занятий` : 'без ограничений'} · {pass.days} {pass.days === 1 ? 'день' : 'дней'}
          </p>
          <p className="td-per">≈ {rub(perSession)} за занятие</p>
          <button type="button" onClick={() => setPassDone(true)}>{passDone ? 'мы напишем вам в течение часа' : 'оформить'}</button>
        </div>
      </section>

      <section className="td-teachers" id="teachers">
        <header className="td-sec">
          <p>тренеры</p>
          <h2>Кто ведёт</h2>
        </header>
        <ul>
          {TEACHERS.map((item, index) => (
            <li key={item.name} style={{ '--shift': `${index * 9}%` }}>
              <h3>{item.name}</h3>
              <p className="td-role">{item.role}</p>
              <blockquote>{item.quote}</blockquote>
            </li>
          ))}
        </ul>
      </section>

      <section className="td-facts">
        <dl>
          {FACTS.map(([big, text]) => (
            <div key={big}>
              <dt>{big}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="td-trial" id="trial">
        <header className="td-sec">
          <p>пробное занятие</p>
          <h2>Первый раз — в подарок</h2>
        </header>
        {trialDone ? (
          <p className="td-trial-done" role="status">
            {trial.name}, мы держим для вас место на «{PRACTICES.find((item) => item.id === trial.practice).name}». Напишем, когда будет ближайшее окно.
          </p>
        ) : (
          <form onSubmit={submitTrial}>
            <label>
              имя
              <input value={trial.name} onChange={(event) => setTrial({ ...trial, name: event.target.value })} required autoComplete="given-name" />
            </label>
            <label>
              телефон
              <input value={trial.phone} onChange={(event) => setTrial({ ...trial, phone: event.target.value })} inputMode="tel" autoComplete="tel" />
            </label>
            <label>
              практика
              <select value={trial.practice} onChange={(event) => setTrial({ ...trial, practice: event.target.value })}>
                {PRACTICES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <button type="submit">держать место</button>
          </form>
        )}
        <p className="td-practice-hint">Сейчас выбрано в разделе практик: {practice.name}.</p>
      </section>

      <footer className="td-foot">
        <p>зал у воды · Кадетская линия В.О., 5<br />коврик свой · дверь с набережной</p>
        <p>пн–пт 07:00–21:00 · сб–вс 10:00–20:00<br /><a href="tel:+78125550710">+7 812 555-07-10</a></p>
        <Link to="/">← портфолио</Link>
      </footer>
    </main>
  )
}
