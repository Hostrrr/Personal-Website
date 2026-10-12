import { useState } from 'react'
import usePageFont from '../usePageFont'
import './page.css'

const CUTS = [
  { id: 'clipper', name: 'машинка', minutes: 20, note: 'коротко, без укладки' },
  { id: 'scissors', name: 'ножницы', minutes: 45, note: 'форма, мытьё, укладка' },
  { id: 'beard', name: 'борода', minutes: 25, note: 'контур и масло' },
  { id: 'grey', name: 'камуфляж седины', minutes: 30, note: 'виски и борода' },
  { id: 'pair', name: 'отец и сын', minutes: 70, note: 'два кресла подряд' },
]

const MAX_MINUTES = 70

export default function BarberPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,480;0,7..72,700;1,7..72,480&family=Oswald:wght@400;500&display=swap',
  )

  const [cut, setCut] = useState(CUTS[1].id)
  const [held, setHeld] = useState(null)

  const selected = CUTS.find((item) => item.id === cut)

  function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setHeld({
      name: String(data.get('name') || '').trim(),
      cut: selected.name,
      minutes: selected.minutes,
    })
  }

  return (
    <main className="br">
      <section className="br-time" aria-label="Ближайшее окно">
        <p className="br-kicker">ближайшее окно</p>
        <h1>14:40</h1>
        <p className="br-chair">сегодня · кресло 2 · Лёша</p>
        <p className="br-place">мастерская «Север»<br />Большой пр., 48</p>
      </section>

      <div className="br-pole" aria-hidden="true" />

      <section className="br-board">
        <header className="br-head">
          <p>запись</p>
          <h2>Север</h2>
        </header>

        <ul className="br-ruler" aria-label="Услуги по длительности">
          {CUTS.map((item) => (
            <li key={item.id} style={{ '--len': item.minutes / MAX_MINUTES }}>
              <button
                type="button"
                className={item.id === cut ? 'is-on' : ''}
                onClick={() => setCut(item.id)}
              >
                <span className="br-blade" />
                <span className="br-cut-name">{item.name}</span>
                <span className="br-cut-note">{item.note}</span>
                <span className="br-mins">{item.minutes} мин</span>
              </button>
            </li>
          ))}
        </ul>

        {held ? (
          <p className="br-held" role="status">
            {held.name}, окно 14:40 держат десять минут.
            <span>{held.cut} · {held.minutes} мин · Лёша</span>
          </p>
        ) : (
          <form className="br-ticket" onSubmit={onSubmit}>
            <label>
              имя
              <input name="name" required autoComplete="name" placeholder="как к вам обращаться" />
            </label>
            <p className="br-chosen">{selected.name} · {selected.minutes} мин</p>
            <button type="submit">держать 14:40</button>
          </form>
        )}
      </section>
    </main>
  )
}
