import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import usePageFont from '../usePageFont'
import { DRAWINGS } from './drawingMap'
import { CALC_STAGES, NOTES, PROJECTS, REVISIONS, SHEETS, STATS, TYPES } from './data'
import './page.css'

function rub(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`
}

function Sheet({ id, no, title, children }) {
  return (
    <section className="ln-sheet" id={id}>
      <span className="ln-crop ln-crop--tl" />
      <span className="ln-crop ln-crop--tr" />
      <span className="ln-crop ln-crop--bl" />
      <span className="ln-crop ln-crop--br" />
      <div className="ln-body">{children}</div>
      <footer className="ln-block" aria-label={`Штамп листа ${no}`}>
        <p>Линия</p>
        <div><span>лист</span><b>{no}</b></div>
        <div><span>название</span><b>{title}</b></div>
        <div><span>масштаб</span><b>1:100</b></div>
        <div><span>дата</span><b>12.03.26</b></div>
      </footer>
    </section>
  )
}

function Viewer({ project, layers }) {
  const frameRef = useRef(null)
  const vRef = useRef(null)
  const hRef = useRef(null)
  const labelRef = useRef(null)
  const Drawing = DRAWINGS[project.id]

  function onMove(event) {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    vRef.current.style.transform = `translateX(${x}px)`
    hRef.current.style.transform = `translateY(${y}px)`
    const mmX = Math.round(((x / rect.width) * 12800) / 10) * 10
    const mmY = Math.round(((y / rect.height) * 8400) / 10) * 10
    labelRef.current.textContent = `x ${mmX.toLocaleString('ru-RU')} · y ${mmY.toLocaleString('ru-RU')} мм`
    labelRef.current.style.transform = `translate(${Math.min(x + 12, rect.width - 190)}px, ${Math.max(y - 26, 4)}px)`
  }

  return (
    <figure
      className="ln-viewer"
      ref={frameRef}
      onPointerMove={onMove}
      data-dims={layers.dims ? 'on' : 'off'}
      data-hatch={layers.hatch ? 'on' : 'off'}
      data-grid={layers.grid ? 'on' : 'off'}
    >
      <svg viewBox="0 0 640 420" key={project.id} role="img" aria-label={`${project.name}, ${project.view}`}>
        <Drawing />
      </svg>
      <span className="ln-cross ln-cross--v" ref={vRef} aria-hidden="true" />
      <span className="ln-cross ln-cross--h" ref={hRef} aria-hidden="true" />
      <span className="ln-coords" ref={labelRef} aria-hidden="true" />
      <figcaption>
        <b>{project.no}</b> {project.name}
        <small>{project.view}</small>
        {project.note ? <em>{project.note}</em> : null}
      </figcaption>
    </figure>
  )
}

export default function LinePage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Yeseva+One&display=swap',
  )

  const [active, setActive] = useState('a01')
  const [projectId, setProjectId] = useState('house')
  const [layers, setLayers] = useState({ dims: true, hatch: true, grid: true })
  const [area, setArea] = useState(180)
  const [picked, setPicked] = useState({ sketch: true, design: true, work: true, author: false })
  const [request, setRequest] = useState({ name: '', email: '', type: TYPES[0], area: '', text: '' })
  const [sent, setSent] = useState(null)

  useEffect(() => {
    const nodes = SHEETS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const project = PROJECTS.find((item) => item.id === projectId)
  const chosen = CALC_STAGES.filter((stage) => picked[stage.id])
  const total = chosen.reduce((sum, stage) => sum + stage.rate * area, 0)
  const weeks = Math.round(chosen.reduce((sum, stage) => sum + stage.weeks, 0) * (0.7 + area / 400))

  function toggleLayer(key) {
    setLayers((current) => ({ ...current, [key]: !current[key] }))
  }

  function submit(event) {
    event.preventDefault()
    if (!request.name.trim() || !request.email.trim()) return
    setSent({ no: `ЗП-${String((request.name.length * 37 + request.email.length * 11) % 900 + 100)}`, name: request.name.trim() })
  }

  return (
    <main className="ln">
      <svg width="0" height="0" className="ln-defs" aria-hidden="true">
        <defs>
          <pattern id="ln-hatch-pat" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0 V6" stroke="#242424" strokeWidth="0.9" />
          </pattern>
        </defs>
      </svg>

      <nav className="ln-index" aria-label="Листы">
        {SHEETS.map(([id, no, title]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'is-on' : ''} aria-current={active === id ? 'true' : undefined}>
            <b>{no}</b>
            <span>{title}</span>
          </a>
        ))}
      </nav>

      <Sheet id="a01" no="A-01" title="обложка">
        <header className="ln-cover">
          <p className="ln-small">архитектурное бюро · Санкт-Петербург</p>
          <h1>Линия</h1>
          <p className="ln-lead">Проектируем дома, павильоны и лестницы. Нарисуем от руки, посчитаем, проследим за стройкой.</p>
          <ul className="ln-stats">
            {STATS.map(([value, label]) => (
              <li key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </header>
        <div className="ln-cover-draw" data-dims="on" data-hatch="on" data-grid="off">
          <svg viewBox="0 0 640 420" aria-hidden="true">
            <DRAWINGS.house />
          </svg>
        </div>
      </Sheet>

      <Sheet id="a02" no="A-02" title="проекты">
        <h2 className="ln-h">Проекты</h2>
        <div className="ln-projects">
          <div>
            <table className="ln-table">
              <thead>
                <tr><th>№</th><th>объект</th><th>место</th><th>м²</th><th>год</th></tr>
              </thead>
              <tbody>
                {PROJECTS.map((item) => (
                  <tr key={item.id} className={item.id === projectId ? 'is-on' : ''}>
                    <td colSpan={5}>
                      <button type="button" onClick={() => setProjectId(item.id)} aria-pressed={item.id === projectId}>
                        <span>{item.no}</span>
                        <strong>{item.name}</strong>
                        <span>{item.place}</span>
                        <span>{item.area}</span>
                        <span>{item.year}</span>
                        <em>{item.status}</em>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ln-layers" role="group" aria-label="Слои чертежа">
              <span>слои</span>
              {[['dims', 'размеры'], ['hatch', 'штриховка'], ['grid', 'сетка']].map(([key, label]) => (
                <button key={key} type="button" aria-pressed={layers[key]} onClick={() => toggleLayer(key)}>
                  <i aria-hidden="true" />{label}
                </button>
              ))}
            </div>
            <p className="ln-hint">Наведите курсор на чертёж: перекрестие покажет координаты в миллиметрах.</p>
          </div>
          <Viewer project={project} layers={layers} />
        </div>
      </Sheet>

      <Sheet id="a03" no="A-03" title="бюро">
        <h2 className="ln-h">Бюро</h2>
        <div className="ln-about">
          <div>
            <h3>Общие указания</h3>
            <ol>
              {NOTES.map((note) => <li key={note}>{note}</li>)}
            </ol>
          </div>
          <div>
            <h3>Таблица изменений</h3>
            <table className="ln-rev">
              <thead>
                <tr><th>изм.</th><th>дата</th><th>автор</th><th>описание</th></tr>
              </thead>
              <tbody>
                {REVISIONS.map(([rev, date, who, text], index) => (
                  <tr key={rev} className={index === REVISIONS.length - 1 ? 'is-last' : ''}>
                    <th scope="row">{rev}</th>
                    <td>{date}</td>
                    <td>{who}</td>
                    <td>{text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sheet>

      <Sheet id="a04" no="A-04" title="услуги">
        <h2 className="ln-h">Услуги</h2>
        <div className="ln-calc">
          <div>
            <table className="ln-stages">
              <thead>
                <tr><th /><th>код</th><th>стадия</th><th>₽/м²</th><th>нед.</th></tr>
              </thead>
              <tbody>
                {CALC_STAGES.map((stage) => (
                  <tr key={stage.id}>
                    <td>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={picked[stage.id]}
                        aria-label={stage.name}
                        onClick={() => setPicked((current) => ({ ...current, [stage.id]: !current[stage.id] }))}
                      />
                    </td>
                    <td>{stage.code}</td>
                    <td>{stage.name}<small>{stage.note}</small></td>
                    <td>{stage.rate}</td>
                    <td>{stage.weeks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label className="ln-range">
              площадь объекта
              <input type="range" min="40" max="600" step="10" value={area} onChange={(event) => setArea(Number(event.target.value))} />
              <output>{area} м²</output>
            </label>
          </div>
          <aside className="ln-total" aria-live="polite">
            <p>ориентировочно</p>
            <b>{chosen.length ? rub(total) : '—'}</b>
            <p>{chosen.length ? `срок проектирования ≈ ${weeks || 1} нед.` : 'отметьте стадии слева'}</p>
            <div className="ln-bar" aria-hidden="true">
              {chosen.map((stage) => (
                <i key={stage.id} style={{ flexGrow: stage.rate }}><span>{stage.code}</span></i>
              ))}
            </div>
            <small>Точная смета — после первой встречи и осмотра участка.</small>
          </aside>
        </div>
      </Sheet>

      <Sheet id="a05" no="A-05" title="запрос">
        <h2 className="ln-h">Запрос на проект</h2>
        <div className="ln-contact">
          {sent ? (
            <p className="ln-sent" role="status">
              <b>Лист {sent.no} принят.</b>
              {sent.name}, мы ответим в течение двух рабочих дней и предложим время для встречи.
            </p>
          ) : (
            <form onSubmit={submit}>
              <label>
                имя
                <input value={request.name} onChange={(event) => setRequest({ ...request, name: event.target.value })} required autoComplete="name" />
              </label>
              <label>
                e-mail
                <input type="email" value={request.email} onChange={(event) => setRequest({ ...request, email: event.target.value })} required autoComplete="email" />
              </label>
              <label>
                что строим
                <select value={request.type} onChange={(event) => setRequest({ ...request, type: event.target.value })}>
                  {TYPES.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label>
                площадь, м²
                <input inputMode="numeric" value={request.area} onChange={(event) => setRequest({ ...request, area: event.target.value })} />
              </label>
              <label className="ln-wide">
                коротко о задаче
                <textarea rows="3" value={request.text} onChange={(event) => setRequest({ ...request, text: event.target.value })} />
              </label>
              <button type="submit">отправить лист</button>
            </form>
          )}
          <address>
            Санкт-Петербург, Мытнинская ул., 21<br />
            пн–пт, 10:00–19:00<br />
            <a href="tel:+78125551401">+7 812 555-14-01</a><br />
            <a href="mailto:hello@liniya.example">hello@liniya.example</a>
            <Link to="/">← портфолио</Link>
          </address>
        </div>
      </Sheet>
    </main>
  )
}
