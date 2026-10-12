export const ROUTE_KM = 14.6

export const ELEVATION = [
  [0, 320], [1.4, 395], [2.9, 520], [4.8, 710], [7.2, 1020],
  [9.1, 940], [11, 760], [12.8, 610], [14.6, 430],
]

const ALL = ['spring', 'summer', 'autumn', 'winter']

export const GEAR = [
  {
    id: 'jacket', km: 1.4, name: 'куртка «сухой ход»', weight: 380, price: 18900,
    note: 'Мембрана, капюшон прячется в ворот.',
    specs: ['мембрана 3L, 20 000 мм', 'швы проклеены', 'капюшон под каску'],
    seasons: ['spring', 'autumn', 'winter'],
  },
  {
    id: 'lamp', km: 2.9, name: 'лампа «светляк»', weight: 85, price: 3400,
    note: 'Красный режим, чтобы не слепить спутников.',
    specs: ['400 люмен', 'USB-C, 40 часов', 'влагозащита IPX6'],
    seasons: ALL,
  },
  {
    id: 'pack', km: 4.8, name: 'рюкзак 28', weight: 910, price: 12400,
    note: 'Пояс, карман фляги на лямке.',
    specs: ['28 литров, пластина в спине', 'карманы достаются на ходу', 'чехол от дождя в комплекте'],
    seasons: ALL,
  },
  {
    id: 'bottle', km: 7.2, name: 'фляга 0.6', weight: 120, price: 2900,
    note: 'Сталь, не гремит о карабин.',
    specs: ['нержавеющая сталь', 'горло под фильтр', 'крышка на шнурке'],
    seasons: ALL,
  },
  {
    id: 'tarp', km: 9.1, name: 'тент-плащ', weight: 330, price: 9800,
    note: 'Крыша на двоих и накидка от дождя.',
    specs: ['2.4 × 3 м, силнейлон', 'ставится на трекинговые палки', 'люверсы усилены'],
    seasons: ['spring', 'summer', 'autumn'],
  },
  {
    id: 'boot', km: 11, name: 'ботинок «кора»', weight: 640, price: 15900,
    note: 'Подошва держит мокрый корень.',
    specs: ['вес указан за один ботинок', 'мембрана, высокий борт', 'подошва протектор 5 мм'],
    seasons: ['spring', 'autumn', 'winter'],
  },
  {
    id: 'socks', km: 12.8, name: 'носки «шерсть+»', weight: 70, price: 1100,
    note: 'Мериносовая шерсть, без шва у пальцев.',
    specs: ['мериносовая шерсть 62%', 'усиленная пятка', 'пара на 100 км'],
    seasons: ALL,
  },
]

export const SEASONS = [
  { id: 'spring', name: 'весна', temp: '+3°', wind: '6 м/с', rain: '55%', light: '14 ч', tip: 'Мокро и ветрено. Берём мембрану и тент.' },
  { id: 'summer', name: 'лето', temp: '+14°', wind: '3 м/с', rain: '30%', light: '19 ч', tip: 'Ночь светлая и короткая. Хватит лампы и воды.' },
  { id: 'autumn', name: 'осень', temp: '+1°', wind: '7 м/с', rain: '60%', light: '11 ч', tip: 'Темнеет рано, корни скользкие. Ботинки обязательны.' },
  { id: 'winter', name: 'зима', temp: '−12°', wind: '5 м/с', rain: '20%', light: '6 ч', tip: 'Холодно и тихо. Мембрана, шерсть, запас света.' },
]

export const PROMISES = [
  ['10', 'лет гарантии', 'на швы, молнии и ткань. Если порвалось само — приносите.'],
  ['0 ₽', 'за ремонт', 'чиним в мастерской бесплатно, даже если порвали сами.'],
  ['30', 'ночей на обмен', 'не подошло после похода — вернём деньги или заменим.'],
]

export function elevationAt(km) {
  const clamped = Math.min(ROUTE_KM, Math.max(0, km))
  for (let i = 0; i < ELEVATION.length - 1; i += 1) {
    const [k0, m0] = ELEVATION[i]
    const [k1, m1] = ELEVATION[i + 1]
    if (clamped >= k0 && clamped <= k1) {
      const t = (clamped - k0) / (k1 - k0)
      const eased = (1 - Math.cos(t * Math.PI)) / 2
      return m0 + (m1 - m0) * eased
    }
  }
  return ELEVATION[ELEVATION.length - 1][1]
}
