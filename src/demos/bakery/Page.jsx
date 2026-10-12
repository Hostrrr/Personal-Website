import usePageFont from '../usePageFont'
import './page.css'

const LINES = [
  { kind: 'meta', text: 'пекарня · наб. Карповки, 14' },
  { kind: 'meta', text: 'смена 1 · печь №2 · опару поставили' },
  { kind: 'rule' },
  { kind: 'item', name: 'бородинский 400 г', price: '180' },
  { kind: 'item', name: 'чиабатта', price: '140' },
  { kind: 'item', name: 'круассан, масло', price: '160' },
  { kind: 'item', name: 'слойка с творогом', price: '170' },
  { kind: 'item', name: 'фильтр 200 мл', price: '120' },
  { kind: 'item', name: 'сметана 20%', price: '90' },
  { kind: 'rule' },
  { kind: 'sum', name: 'витрина с 08:00', price: '6 поз.' },
  { kind: 'meta', text: 'закрыто после 19:00' },
  { kind: 'meta', text: 'сдача наличными у кассы у окна' },
]

export default function BakeryPage() {
  usePageFont(
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Unbounded:wght@500;700&display=swap',
  )

  return (
    <main className="bk">
      <article className="bk-slip" aria-label="Чек пекарни Утро">
        <p className="bk-line bk-kicker" style={{ '--i': 0 }}>кассовая лента</p>
        <h1 className="bk-line bk-name" style={{ '--i': 1 }}>утро</h1>
        <p className="bk-line bk-clock" style={{ '--i': 2 }}>04:12</p>
        <ol className="bk-tape">
          {LINES.map((line, index) => {
            const delay = { '--i': index + 3 }
            if (line.kind === 'rule') {
              return <li key={index} className="bk-line bk-rule" style={delay} />
            }
            if (line.kind === 'item' || line.kind === 'sum') {
              return (
                <li key={line.name} className={`bk-line bk-row${line.kind === 'sum' ? ' is-sum' : ''}`} style={delay}>
                  <span>{line.name}</span>
                  <span className="bk-dots" aria-hidden="true" />
                  <span className="bk-price">{line.price}</span>
                </li>
              )
            }
            return (
              <li key={line.text} className="bk-line bk-meta" style={delay}>{line.text}</li>
            )
          })}
        </ol>
        <p className="bk-stamp" style={{ '--i': LINES.length + 4 }}>смена<br />открыта</p>
      </article>
    </main>
  )
}
