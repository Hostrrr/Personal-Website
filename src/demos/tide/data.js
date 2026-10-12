export const PRACTICES = [
  {
    id: 'still',
    name: 'тихая вода',
    kind: 'инь и дыхание',
    level: 0.4,
    amp: 6,
    periods: 2,
    seconds: 14,
    text: 'Сорок минут в положениях, из которых не хочется выходить. Для вечера и для тех, кто устал.',
  },
  {
    id: 'exhale',
    name: 'длинный выдох',
    kind: 'мобильность и растяжка',
    level: 1.1,
    amp: 12,
    periods: 3,
    seconds: 10,
    text: 'Суставы, спина, бёдра. Идём медленно и без героизма: цель — выйти длиннее, чем зашли.',
  },
  {
    id: 'window',
    name: 'открытое окно',
    kind: 'поток и лёгкая сила',
    level: 0.7,
    amp: 16,
    periods: 4,
    seconds: 8,
    text: 'Связки движений под дыхание. Утренний класс, после которого голова ясная до обеда.',
  },
  {
    id: 'salt',
    name: 'соль',
    kind: 'сила и баланс',
    level: 1.8,
    amp: 24,
    periods: 5,
    seconds: 6,
    text: 'Самый горячий класс недели. Планки, стойки, медленные подъёмы. Выходите мокрыми и довольными.',
  },
]

const P = Object.fromEntries(PRACTICES.map((item) => [item.id, item]))

function cls(time, id, teacher, len, spots) {
  return { time, id, name: P[id].name, level: P[id].level, teacher, len, spots }
}

export const DAYS = [
  { key: 'пн', classes: [cls('07:10', 'still', 'Мира', 45, 4), cls('09:40', 'exhale', 'Ян', 60, 3), cls('12:15', 'window', 'Лея', 50, 6), cls('18:30', 'salt', 'Ян', 60, 2), cls('20:00', 'still', 'Мира', 45, 5)] },
  { key: 'вт', classes: [cls('08:00', 'window', 'Лея', 50, 5), cls('10:30', 'exhale', 'Мира', 60, 4), cls('17:30', 'salt', 'Ян', 60, 1), cls('19:30', 'still', 'Лея', 45, 6)] },
  { key: 'ср', classes: [cls('07:10', 'still', 'Мира', 45, 6), cls('09:40', 'exhale', 'Ян', 60, 2), cls('12:15', 'window', 'Лея', 50, 5), cls('16:00', 'salt', 'Ян', 60, 3), cls('19:30', 'exhale', 'Мира', 60, 4)] },
  { key: 'чт', classes: [cls('08:00', 'window', 'Лея', 50, 6), cls('11:00', 'still', 'Мира', 45, 5), cls('18:00', 'salt', 'Ян', 60, 2), cls('20:00', 'exhale', 'Лея', 60, 4)] },
  { key: 'пт', classes: [cls('07:10', 'exhale', 'Мира', 60, 3), cls('09:40', 'window', 'Лея', 50, 4), cls('16:00', 'salt', 'Ян', 60, 5), cls('19:30', 'still', 'Мира', 45, 6)] },
  { key: 'сб', classes: [cls('10:00', 'window', 'Лея', 50, 5), cls('11:30', 'salt', 'Ян', 60, 2), cls('13:30', 'exhale', 'Мира', 60, 6), cls('18:00', 'still', 'Лея', 45, 6)] },
  { key: 'вс', classes: [cls('10:30', 'exhale', 'Мира', 60, 4), cls('12:30', 'still', 'Мира', 45, 6), cls('19:00', 'window', 'Лея', 50, 5)] },
]

export const PASSES = [
  { id: 'one', name: 'разовое', price: 1600, sessions: 1, days: 1, level: 0.28, note: 'попробовать, не обещая ничего' },
  { id: 'eight', name: 'восемь приливов', price: 10400, sessions: 8, days: 60, level: 0.62, note: 'два месяца, любые классы' },
  { id: 'open', name: 'полный берег', price: 14900, sessions: null, days: 30, level: 1, note: 'без ограничений, месяц' },
]

export const TEACHERS = [
  { name: 'Мира', role: 'инь, дыхание, длинный выдох', quote: 'Если вы выдохнули — вы уже на коврике.' },
  { name: 'Ян', role: 'соль, баланс, силовые', quote: 'Дрожит — значит работает. Дышите, мы подождём.' },
  { name: 'Лея', role: 'открытое окно, потоки', quote: 'Двигаться не обязательно красиво, обязательно честно.' },
]

export const FACTS = [
  ['140 м²', 'зал с видом на воду, пол из лиственницы'],
  ['12 мест', 'не больше, чтобы тренер видел каждого'],
  ['3 душа', 'тёплая вода и нормальные полотенца'],
  ['коврики', 'есть наши, но лучше свой'],
]
