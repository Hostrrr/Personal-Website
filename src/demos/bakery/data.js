export const CATS = ['всё', 'хлеб', 'сладкое', 'кофе']

export const MENU = [
  { id: 'borodino', cat: 'хлеб', glyph: 'loaf', name: 'бородинский', note: 'солод, кориандр, заварная мука', weight: '400 г', price: 180 },
  { id: 'wheat', cat: 'хлеб', glyph: 'loaf', name: 'пшеничный на закваске', note: 'ферментируем 18 часов', weight: '550 г', price: 210 },
  { id: 'ciabatta', cat: 'хлеб', glyph: 'ciabatta', name: 'чиабатта', note: 'тянется, дырявая, с оливковым маслом', weight: '300 г', price: 140 },
  { id: 'baguette', cat: 'хлеб', glyph: 'baguette', name: 'багет', note: 'хруст слышно с порога', weight: '250 г', price: 130 },
  { id: 'croissant', cat: 'сладкое', glyph: 'croissant', name: 'круассан', note: 'масло 82%, двадцать семь слоёв', weight: '90 г', price: 160 },
  { id: 'twist', cat: 'сладкое', glyph: 'twist', name: 'слойка с творогом', note: 'творог, ваниль, цедра', weight: '110 г', price: 170 },
  { id: 'bun', cat: 'сладкое', glyph: 'bun', name: 'булка с кардамоном', note: 'сливочная, липкая сверху', weight: '120 г', price: 150 },
  { id: 'filter', cat: 'кофе', glyph: 'cup', name: 'фильтр', note: 'обжарка соседей с Петроградской', weight: '200 мл', price: 120 },
  { id: 'flat', cat: 'кофе', glyph: 'cup', name: 'флэт уайт', note: 'двойной эспрессо, молоко 3,2%', weight: '180 мл', price: 190 },
  { id: 'cocoa', cat: 'кофе', glyph: 'glass', name: 'какао на молоке', note: 'настоящее, не из пакетика', weight: '250 мл', price: 170 },
]

export const STAGES = [
  { t: '22:00', at: 22 * 60, title: 'замес', text: 'Мука и вода встречаются. Тесто уходит отдыхать до утра.' },
  { t: '04:12', at: 4 * 60 + 12, title: 'опара', text: 'Приходит Лёва, ставит опару и включает печь №2.' },
  { t: '05:40', at: 5 * 60 + 40, title: 'формовка', text: 'Руками, без машины. Багеты считаем по штукам, чтобы не соврать.' },
  { t: '06:40', at: 6 * 60 + 40, title: 'первая печь', text: 'Ржаной и бородинский. Пахнет на всю Карповку.' },
  { t: '08:00', at: 8 * 60, title: 'витрина', text: 'Открываем дверь. Что вынули, то и лежит.' },
  { t: '19:00', at: 19 * 60, title: 'закрыто', text: 'Остатки раздаём соседям. Завтра печём заново.' },
]

export const HOURS = [
  { label: 'пн–пт', days: [1, 2, 3, 4, 5], open: 8 * 60, close: 19 * 60 },
  { label: 'сб–вс', days: [6, 0], open: 9 * 60, close: 18 * 60 },
]

export const PICKUP = Array.from({ length: 21 }, (_, i) => {
  const total = 8 * 60 + i * 30
  const h = String(Math.floor(total / 60)).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return { label: `${h}:${m}`, at: total }
})

export const TAPE = [
  { kind: 'meta', text: 'пекарня · наб. Карповки, 14' },
  { kind: 'meta', text: 'смена 1 · печь №2 · опару поставили' },
  { kind: 'rule' },
  { kind: 'item', name: 'бородинский 400 г', price: '180' },
  { kind: 'item', name: 'чиабатта', price: '140' },
  { kind: 'item', name: 'круассан, масло', price: '160' },
  { kind: 'item', name: 'слойка с творогом', price: '170' },
  { kind: 'item', name: 'фильтр 200 мл', price: '120' },
  { kind: 'rule' },
  { kind: 'sum', name: 'витрина с 08:00', price: '10 поз.' },
  { kind: 'meta', text: 'закрыто после 19:00' },
]
