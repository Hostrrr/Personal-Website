import usePageFont from '../usePageFont'
import './page.css'

const SHEET = [
  ['шифр', 'LN-14'],
  ['масштаб', '1:100'],
  ['дата', '12.03.26'],
  ['лист', 'A-01'],
  ['стадия', 'эскиз'],
]

function HouseSection() {
  return (
    <svg viewBox="0 0 640 250" role="img" aria-label="Разрез жилого дома">
      <path className="ln-draw" pathLength="1" d="M40 210 H600" style={{ animationDelay: '0.02s' }} />
      <path className="ln-draw" pathLength="1" d="M70 210 V92 H250 V210" style={{ animationDelay: '0.08s' }} />
      <path className="ln-draw" pathLength="1" d="M250 92 H430 V210" style={{ animationDelay: '0.14s' }} />
      <path className="ln-draw" pathLength="1" d="M48 92 H272" style={{ animationDelay: '0.2s' }} />
      <path className="ln-draw" pathLength="1" d="M110 210 V150 H190 V210" style={{ animationDelay: '0.26s' }} />
      <path className="ln-draw ln-draw--red" pathLength="1" d="M300 210 V138 H390 V210" style={{ animationDelay: '0.32s' }} />
      <path className="ln-draw" pathLength="1" d="M300 168 H390" style={{ animationDelay: '0.38s' }} />
      <path className="ln-draw" pathLength="1" d="M460 210 V70 H560 V210" style={{ animationDelay: '0.44s' }} />
      <path className="ln-draw" pathLength="1" d="M70 92 L160 42 H250" style={{ animationDelay: '0.5s' }} />
      <path className="ln-dim" pathLength="1" d="M80 198 H240" />
      <path className="ln-tick" d="M80 192 V204 M240 192 V204" />
      <text x="128" y="192">9.60</text>
    </svg>
  )
}

function Pavilion() {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="Навес над входом">
      <path className="ln-draw" pathLength="1" d="M16 168 H304" style={{ animationDelay: '0.45s' }} />
      <path className="ln-draw" pathLength="1" d="M64 168 V86 M150 168 V86 M236 168 V86" style={{ animationDelay: '0.52s' }} />
      <path className="ln-draw" pathLength="1" d="M40 86 H280" style={{ animationDelay: '0.58s' }} />
      <path className="ln-draw" pathLength="1" d="M40 86 L160 28 L280 86" style={{ animationDelay: '0.64s' }} />
      <path className="ln-dim" pathLength="1" d="M64 180 H236" />
      <path className="ln-tick" d="M64 174 V186 M236 174 V186" />
      <text x="132" y="196">4.20</text>
    </svg>
  )
}

function Stair() {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="Лестница на антресоль">
      <path className="ln-draw" pathLength="1" d="M28 176 H292 V24" style={{ animationDelay: '0.5s' }} />
      <path
        className="ln-draw"
        pathLength="1"
        d="M48 176 V146 H92 V116 H136 V86 H180 V56 H224 V32 H270"
        style={{ animationDelay: '0.6s' }}
      />
      <path className="ln-dim" pathLength="1" d="M278 32 V176" />
      <path className="ln-tick" d="M272 32 H284 M272 176 H284" />
      <text x="248" y="108">3.15</text>
    </svg>
  )
}

export default function LinePage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Yeseva+One&display=swap',
  )

  return (
    <main className="ln">
      <span className="ln-crop ln-crop--tl" />
      <span className="ln-crop ln-crop--tr" />
      <span className="ln-crop ln-crop--bl" />
      <span className="ln-crop ln-crop--br" />

      <header className="ln-head">
        <div>
          <p>бюро</p>
          <h1>Линия</h1>
        </div>
        <p className="ln-sheet-no">A-01</p>
      </header>

      <section className="ln-figs" aria-label="Чертежи">
        <figure>
          <HouseSection />
          <figcaption>
            <span>01</span>
            дом на набережной
            <small>разрез 1–1</small>
            <em>правка: окно сдвинуто на 200</em>
          </figcaption>
        </figure>
        <figure>
          <Pavilion />
          <figcaption>
            <span>02</span>
            навес
            <small>фасад дворовый</small>
          </figcaption>
        </figure>
        <figure>
          <Stair />
          <figcaption>
            <span>03</span>
            антресоль
            <small>лестница Л-1</small>
          </figcaption>
        </figure>
      </section>

      <aside className="ln-block" aria-label="Штамп листа">
        <p>Линия</p>
        {SHEET.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </aside>
    </main>
  )
}
