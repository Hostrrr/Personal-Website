import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageFont from '../usePageFont'
import useMinute, { formatClock, localParts } from '../useMinute'
import { EXTRAS, FAQ, JOURNAL, MASTERS, OPEN_AT, RULES, SERVICES, SLOT_COUNT } from './data'
import './page.css'

const DAY_NAMES = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

function rub(value) {
  return `${value.toLocaleString('ru-RU')} ₽`
}

function isTaken(master, dayOffset, index) {
  return (index * master.seed + dayOffset * 5 + master.seed) % 7 < 2
}

function buildSlots(master, dayOffset, nowMin, blocks) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, index) => {
    const start = OPEN_AT + index * 30
    const past = dayOffset === 0 && start < nowMin + 20
    return { index, start, busy: past || isTaken(master, dayOffset, index) }
  })
  return slots.map((slot) => {
    let fits = slot.index + blocks <= SLOT_COUNT
    for (let i = 0; fits && i < blocks; i += 1) {
      if (slots[slot.index + i].busy) fits = false
    }
    return { ...slot, fits }
  })
}

export default function BarberPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,480;0,7..72,700;1,7..72,480&family=Oswald:wght@400;500&display=swap',
  )

  const minute = useMinute()
  const { day: weekday, minutes: nowMin, date } = localParts(minute)

  const [serviceId, setServiceId] = useState('scissors')
  const [masterId, setMasterId] = useState('lesha')
  const [dayOffset, setDayOffset] = useState(0)
  const [slotIndex, setSlotIndex] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [ticket, setTicket] = useState(null)

  const service = SERVICES.find((item) => item.id === serviceId)
  const master = MASTERS.find((item) => item.id === masterId)
  const blocks = Math.ceil(service.minutes / 30)

  const slots = buildSlots(master, dayOffset, nowMin, blocks)
  const firstFree = slots.find((slot) => slot.fits)
  const chosen = slots.find((slot) => slot.index === slotIndex && slot.fits) ?? firstFree

  const days = [0, 1, 2, 3, 4].map((offset) => {
    const target = new Date(date)
    target.setDate(target.getDate() + offset)
    return {
      offset,
      label: offset === 0 ? 'сегодня' : DAY_NAMES[(weekday + offset) % 7],
      num: target.getDate(),
    }
  })

  function pickMaster(id) {
    setMasterId(id)
    setSlotIndex(null)
    setTicket(null)
  }

  function submit(event) {
    event.preventDefault()
    if (!chosen || !name.trim()) return
    const day = days[dayOffset]
    setTicket({
      name: name.trim(),
      time: formatClock(chosen.start),
      day: dayOffset === 0 ? 'сегодня' : `${day.label}, ${day.num}`,
      service: service.name,
      master: master.name,
      minutes: service.minutes,
      price: service.price,
      no: String(((chosen.start + dayOffset * 37) % 900) + 100),
    })
  }

  function bookWith(id) {
    pickMaster(id)
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  }

  const nextFreeFor = (item) => buildSlots(item, 0, nowMin, blocks).find((slot) => slot.fits)

  return (
    <main className="br">
      <nav className="br-nav" aria-label="Разделы">
        <a className="br-logo" href="#book">Север</a>
        <div>
          <a href="#masters">мастера</a>
          <a href="#price">прайс</a>
          <a href="#rules">правила</a>
          <a href="#faq">вопросы</a>
        </div>
        <a className="br-nav-cta" href="#book">записаться</a>
      </nav>

      <div className="br-hero" id="book">
        <section className="br-time" aria-label="Выбранное окно">
          <p className="br-kicker">{ticket ? 'вас ждут' : slotIndex === null ? 'ближайшее окно' : 'ваше окно'}</p>
          <h1>{chosen ? formatClock(chosen.start) : '—:—'}</h1>
          <p className="br-chair">
            {dayOffset === 0 ? 'сегодня' : `${days[dayOffset].label}, ${days[dayOffset].num}`} · {master.name} · {service.name}
          </p>
          <p className="br-place">мастерская «Север»<br />Большой пр. П.С., 48<br />10:00 – 21:00 без выходных</p>
        </section>

        <div className="br-pole" aria-hidden="true" />

        <section className="br-board" aria-label="Запись">
          <header className="br-head">
            <p>запись онлайн</p>
            <h2>Север</h2>
          </header>

          {ticket ? (
            <div className="br-ticket-done" role="status">
              <p className="br-no">талон № {ticket.no}</p>
              <p className="br-done-main">{ticket.name}, ждём вас {ticket.day} в {ticket.time}.</p>
              <dl>
                <div><dt>мастер</dt><dd>{ticket.master}</dd></div>
                <div><dt>услуга</dt><dd>{ticket.service}</dd></div>
                <div><dt>время</dt><dd>{ticket.minutes} мин</dd></div>
                <div><dt>стоимость</dt><dd>{rub(ticket.price)}</dd></div>
              </dl>
              <p className="br-note">Окно держим десять минут. Если что-то изменилось — позвоните +7 812 555-14-40.</p>
              <button type="button" className="br-ghost" onClick={() => setTicket(null)}>записать ещё</button>
            </div>
          ) : (
            <>
              <fieldset className="br-step">
                <legend><b>1</b> услуга</legend>
                <ul className="br-ruler">
                  {SERVICES.map((item) => (
                    <li key={item.id} style={{ '--len': item.minutes / 90 }}>
                      <button
                        type="button"
                        className={item.id === serviceId ? 'is-on' : ''}
                        onClick={() => { setServiceId(item.id); setSlotIndex(null) }}
                      >
                        <span className="br-blade" />
                        <span className="br-cut-name">{item.name}</span>
                        <span className="br-cut-note">{item.note}</span>
                        <span className="br-mins">{item.minutes} мин · {rub(item.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </fieldset>

              <fieldset className="br-step">
                <legend><b>2</b> мастер и время</legend>
                <div className="br-pick">
                  {MASTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={item.id === masterId ? 'is-on' : ''}
                      onClick={() => pickMaster(item.id)}
                    >
                      <span>{item.no}</span>{item.name}
                    </button>
                  ))}
                </div>
                <div className="br-days" role="tablist" aria-label="День">
                  {days.map((item) => (
                    <button
                      key={item.offset}
                      type="button"
                      role="tab"
                      aria-selected={item.offset === dayOffset}
                      onClick={() => { setDayOffset(item.offset); setSlotIndex(null) }}
                    >
                      {item.label}<small>{item.num}</small>
                    </button>
                  ))}
                </div>
                <div className="br-slots">
                  {slots.map((slot) => {
                    const covered = chosen && slot.index >= chosen.index && slot.index < chosen.index + blocks
                    return (
                      <button
                        key={slot.index}
                        type="button"
                        disabled={!slot.fits}
                        className={`${slot.busy ? 'is-busy' : ''}${covered ? ' is-held' : ''}`}
                        aria-pressed={chosen?.index === slot.index}
                        onClick={() => setSlotIndex(slot.index)}
                      >
                        {formatClock(slot.start)}
                      </button>
                    )
                  })}
                </div>
                {!firstFree && <p className="br-none">На этот день окон под услугу нет. Попробуйте другого мастера или завтра.</p>}
              </fieldset>

              <form className="br-form" onSubmit={submit}>
                <fieldset className="br-step">
                  <legend><b>3</b> контакты</legend>
                  <label>
                    имя
                    <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="given-name" placeholder="как к вам обращаться" />
                  </label>
                  <label>
                    телефон
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+7" />
                  </label>
                  <p className="br-chosen">{service.name} · {service.minutes} мин · {rub(service.price)}</p>
                  <button type="submit" disabled={!chosen || !name.trim()}>
                    {chosen ? `держать ${formatClock(chosen.start)}` : 'нет окон'}
                  </button>
                </fieldset>
              </form>
            </>
          )}
        </section>
      </div>

      <section className="br-masters" id="masters">
        <header className="br-sec">
          <p>мастера</p>
          <h2>Три кресла, три характера</h2>
        </header>
        <ol>
          {MASTERS.map((item) => {
            const free = nextFreeFor(item)
            return (
              <li key={item.id}>
                <span className="br-big-no" aria-hidden="true">{item.no}</span>
                <div className="br-m-main">
                  <h3>{item.name}</h3>
                  <p>{item.role} · с {item.since}</p>
                  <p className="br-m-spec">{item.spec}</p>
                </div>
                <div className="br-m-ticks" aria-hidden="true">
                  {Array.from({ length: SLOT_COUNT }, (_, index) => (
                    <i key={index} className={isTaken(item, 0, index) ? 'is-busy' : ''} />
                  ))}
                </div>
                <button type="button" onClick={() => bookWith(item.id)}>
                  {free ? `сегодня ${formatClock(free.start)}` : 'на завтра'}
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="br-price" id="price">
        <header className="br-sec">
          <p>прайс</p>
          <h2>Сколько и за что</h2>
        </header>
        <div className="br-price-grid">
          <ul>
            {SERVICES.map((item) => (
              <li key={item.id}>
                <span>{item.name}<small>{item.minutes} мин</small></span>
                <i aria-hidden="true" />
                <b>{rub(item.price)}</b>
              </li>
            ))}
          </ul>
          <ul>
            {EXTRAS.map(([label, price]) => (
              <li key={label}>
                <span>{label}</span>
                <i aria-hidden="true" />
                <b>{price} ₽</b>
              </li>
            ))}
            <li className="br-price-note">Оплата картой, наличными или по СБП. Чай и кофе без доплаты.</li>
          </ul>
        </div>
      </section>

      <section className="br-rules" id="rules">
        <header className="br-sec">
          <p>правила мастерской</p>
          <h2>Чего у нас нет и что есть</h2>
        </header>
        <ol>
          {RULES.map(([num, text]) => (
            <li key={text}>
              <b>{num}</b>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="br-journal">
        <header className="br-sec br-sec--dark">
          <p>журнал</p>
          <h2>Записи от клиентов</h2>
        </header>
        <table>
          <tbody>
            {JOURNAL.map(([when, text, who]) => (
              <tr key={when}>
                <th scope="row">{when}</th>
                <td>{text}</td>
                <td>{who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="br-faq" id="faq">
        <header className="br-sec">
          <p>вопросы</p>
          <h2>Что спрашивают чаще всего</h2>
        </header>
        <div>
          {FAQ.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="br-foot">
        <p className="br-foot-name">Север</p>
        <address>
          Большой пр. П.С., 48<br />
          10:00 – 21:00, без выходных<br />
          <a href="tel:+78125551440">+7 812 555-14-40</a>
        </address>
        <Link to="/">← портфолио</Link>
      </footer>
    </main>
  )
}
