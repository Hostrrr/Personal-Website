import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageFont from '../usePageFont'
import useMinute, { formatClock, localParts } from '../useMinute'
import Glyph from './Glyph'
import { CATS, HOURS, MENU, PICKUP, STAGES, TAPE } from './data'
import './page.css'

function stageIndex(n) {
  if (n >= STAGES[0].at || n < STAGES[1].at) return 0
  let index = 1
  for (let i = 1; i < STAGES.length; i += 1) {
    if (n >= STAGES[i].at) index = i
  }
  return index
}

function rub(value) {
  return `${value.toLocaleString('ru-RU')} ₽`
}

export default function BakeryPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Unbounded:wght@500;700&display=swap',
  )

  const minute = useMinute()
  const { day, minutes: nowMin } = localParts(minute)
  const todayHours = HOURS.find((row) => row.days.includes(day))
  const isOpen = nowMin >= todayHours.open && nowMin < todayHours.close
  const stage = stageIndex(nowMin)

  const [cat, setCat] = useState('всё')
  const [cart, setCart] = useState({})
  const [drawer, setDrawer] = useState(false)
  const [slot, setSlot] = useState(null)
  const [name, setName] = useState('')
  const [done, setDone] = useState(null)

  const items = cat === 'всё' ? MENU : MENU.filter((item) => item.cat === cat)
  const lines = MENU.filter((item) => cart[item.id]).map((item) => ({ ...item, qty: cart[item.id] }))
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  const count = lines.reduce((sum, line) => sum + line.qty, 0)

  const earliest = isOpen ? nowMin + 30 : todayHours.open
  const slots = PICKUP.map((entry) => ({ ...entry, off: entry.at < earliest || entry.at >= todayHours.close }))
  const fallback = slots.find((entry) => !entry.off) ?? PICKUP[0]
  const picked = slots.find((entry) => entry.label === slot && !entry.off) ?? fallback

  function change(id, delta) {
    setCart((current) => {
      const qty = Math.max(0, (current[id] || 0) + delta)
      const next = { ...current }
      if (qty) next[id] = qty
      else delete next[id]
      return next
    })
    setDone(null)
  }

  function submit(event) {
    event.preventDefault()
    if (!count || !name.trim()) return
    setDone({
      no: String((total * 7) % 900 + 100),
      name: name.trim(),
      time: picked.label,
      count,
      total,
    })
    setCart({})
    setDrawer(false)
  }

  return (
    <main className="bk">
      <nav className="bk-nav" aria-label="Разделы">
        <a className="bk-logo" href="#top">утро</a>
        <div className="bk-links">
          <a href="#menu">витрина</a>
          <a href="#night">как печём</a>
          <a href="#visit">адрес</a>
        </div>
        <p className={`bk-status${isOpen ? ' is-open' : ''}`}>
          <i aria-hidden="true" />
          {isOpen ? `открыто до ${formatClock(todayHours.close)}` : `закрыто · с ${formatClock(todayHours.open)}`}
        </p>
      </nav>

      <header className="bk-hero" id="top">
        <div className="bk-hero-copy">
          <p className="bk-eyebrow">пекарня на Карповке · с 2017</p>
          <h1>утро</h1>
          <p className="bk-lead">
            Печём каждую ночь, чтобы к восьми хлеб ещё помнил печь.
            Закваске семь лет, зовут её Борис.
          </p>
          <div className="bk-actions">
            <a className="bk-btn" href="#menu">собрать заказ</a>
            <a className="bk-link" href="#night">что в печи сейчас ↓</a>
          </div>
          <p className="bk-now">
            сейчас · <b>{STAGES[stage].title}</b> — {STAGES[stage].text}
          </p>
        </div>

        <article className="bk-slip" aria-label="Кассовая лента пекарни">
          <p className="bk-line bk-kicker" style={{ '--i': 0 }}>кассовая лента</p>
          <p className="bk-line bk-clock" style={{ '--i': 1 }}>04:12</p>
          <ol className="bk-tape">
            {TAPE.map((line, index) => {
              const delay = { '--i': index + 2 }
              if (line.kind === 'rule') return <li key={index} className="bk-line bk-rule" style={delay} />
              if (line.kind === 'meta') return <li key={line.text} className="bk-line bk-meta" style={delay}>{line.text}</li>
              return (
                <li key={line.name} className={`bk-line bk-row${line.kind === 'sum' ? ' is-sum' : ''}`} style={delay}>
                  <span>{line.name}</span>
                  <span className="bk-dots" aria-hidden="true" />
                  <span>{line.price}</span>
                </li>
              )
            })}
          </ol>
          <p className="bk-stamp" style={{ '--i': TAPE.length + 3 }}>смена<br />открыта</p>
        </article>
      </header>

      <section className="bk-shop" id="menu">
        <div className="bk-menu-col">
          <header className="bk-head">
            <span>01</span>
            <h2>витрина</h2>
            <p>что нажмёте — упадёт в чек справа</p>
          </header>

          <div className="bk-cats" role="tablist" aria-label="Категории">
            {CATS.map((entry) => (
              <button
                key={entry}
                type="button"
                role="tab"
                aria-selected={cat === entry}
                onClick={() => setCat(entry)}
              >
                {entry}
              </button>
            ))}
          </div>

          <ul className="bk-menu">
            {items.map((item) => (
              <li key={item.id} className={cart[item.id] ? 'is-in' : ''}>
                <Glyph name={item.glyph} />
                <div className="bk-item">
                  <strong>{item.name}</strong>
                  <span>{item.note}</span>
                </div>
                <span className="bk-weight">{item.weight}</span>
                <b className="bk-price">{rub(item.price)}</b>
                <div className="bk-step">
                  {cart[item.id] ? (
                    <>
                      <button type="button" aria-label={`убрать ${item.name}`} onClick={() => change(item.id, -1)}>−</button>
                      <output>{cart[item.id]}</output>
                    </>
                  ) : null}
                  <button type="button" aria-label={`добавить ${item.name}`} onClick={() => change(item.id, 1)}>+</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className={`bk-cart${drawer ? ' is-open' : ''}`} id="order" aria-label="Чек заказа">
          <button
            type="button"
            className="bk-cart-bar"
            aria-expanded={drawer}
            onClick={() => setDrawer((value) => !value)}
          >
            <span>чек заказа</span>
            <span>{count ? `${count} поз. · ${rub(total)}` : 'пусто'}</span>
          </button>

          <div className="bk-cart-body">
            {done ? (
              <div className="bk-done" role="status">
                <p className="bk-done-no">№ {done.no}</p>
                <p>{done.name}, заказ принят.</p>
                <p>забрать сегодня в <b>{done.time}</b></p>
                <p>{done.count} поз. · {rub(done.total)} · оплата на кассе</p>
                <p className="bk-done-stamp">пробито</p>
                <button type="button" className="bk-link" onClick={() => setDone(null)}>собрать ещё</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                {lines.length ? (
                  <ul className="bk-lines">
                    {lines.map((line) => (
                      <li key={line.id}>
                        <span>{line.name} × {line.qty}</span>
                        <i aria-hidden="true" />
                        <span>{rub(line.price * line.qty)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="bk-empty">пока ничего не выбрано. хлеб лучше брать до обеда.</p>
                )}

                <p className="bk-total"><span>итого</span><b>{rub(total)}</b></p>

                <fieldset className="bk-slots">
                  <legend>забрать в</legend>
                  <div>
                    {slots.map((entry) => (
                      <button
                        key={entry.label}
                        type="button"
                        disabled={entry.off}
                        aria-pressed={picked.label === entry.label}
                        onClick={() => setSlot(entry.label)}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="bk-field">
                  имя
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="как вас позвать" autoComplete="given-name" />
                </label>

                <button type="submit" className="bk-btn bk-pay" disabled={!count || !name.trim()}>
                  пробить заказ
                </button>
              </form>
            )}
          </div>
        </aside>
      </section>

      <section className="bk-night" id="night">
        <header className="bk-head bk-head--light">
          <span>02</span>
          <h2>как печём</h2>
          <p>сутки пекарни, подсвечено то, что происходит сейчас</p>
        </header>
        <ol className="bk-stages">
          {STAGES.map((entry, index) => (
            <li key={entry.t} aria-current={index === stage ? 'step' : undefined} className={index === stage ? 'is-now' : ''}>
              <time>{entry.t}</time>
              <strong>{entry.title}</strong>
              <p>{entry.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bk-visit" id="visit">
        <div className="bk-visit-copy">
          <header className="bk-head bk-head--light">
            <span>03</span>
            <h2>адрес</h2>
          </header>
          <address>
            наб. реки Карповки, 14<br />
            вход со двора, дверь с колокольчиком<br />
            <a href="tel:+78125550412">+7 812 555-04-12</a>
          </address>
          <table className="bk-hours">
            <tbody>
              {HOURS.map((row) => (
                <tr key={row.label} className={row.days.includes(day) ? 'is-today' : ''}>
                  <th scope="row">{row.label}</th>
                  <td>{formatClock(row.open)} – {formatClock(row.close)}</td>
                  <td>{row.days.includes(day) ? 'сегодня' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="bk-small">Остатки после закрытия отдаём соседям. Для заказов больше 15 позиций пишите накануне.</p>
        </div>

        <svg className="bk-map" viewBox="0 0 360 300" role="img" aria-label="Схема: пекарня у канала">
          <path className="bk-water" d="M-10 170 C70 130 120 210 200 160 S320 90 380 130 V210 C320 170 260 230 190 210 S60 180 -10 215 Z" />
          <path className="bk-street" d="M60 0 V300 M0 60 H360 M250 0 L210 300" />
          <path className="bk-bridge" d="M118 150 L140 190" />
          <g transform="translate(212 110)">
            <circle className="bk-pulse" r="14" />
            <circle className="bk-pin" r="5" />
          </g>
          <text x="226" y="106">утро</text>
          <text x="20" y="150" className="bk-water-label">Карповка</text>
          <text x="262" y="270" className="bk-street-label">ул. Профессора Попова</text>
        </svg>
      </section>

      <footer className="bk-foot">
        <p>спасибо, что дочитали до конца. приходите завтра, будет другой хлеб.</p>
        <Link to="/">← портфолио</Link>
      </footer>
    </main>
  )
}
