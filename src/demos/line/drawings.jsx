function P({ d, delay = 0, red = false, thin = false }) {
  const cls = `ln-draw${red ? ' ln-draw--red' : ''}${thin ? ' ln-draw--thin' : ''}`
  return <path className={cls} pathLength="1" d={d} style={{ animationDelay: `${delay}s` }} />
}

function Dim({ d, ticks, text, x, y }) {
  return (
    <g className="ln-dims">
      <path className="ln-dim" pathLength="1" d={d} />
      <path className="ln-tick" d={ticks} />
      <text x={x} y={y}>{text}</text>
    </g>
  )
}

function Hatch({ x, y, w, h }) {
  return <rect className="ln-hatch" x={x} y={y} width={w} height={h} />
}

export function House() {
  return (
    <>
      <Hatch x="30" y="340" w="580" h="14" />
      <P d="M30 340 H610" />
      <P d="M80 340 V170 H300 V340" delay={0.08} />
      <P d="M300 170 H500 V340" delay={0.16} />
      <P d="M60 170 L180 100 H300" delay={0.24} />
      <P d="M530 340 V120 H600 V340" delay={0.32} />
      <P d="M120 340 V262 H200 V340" delay={0.4} />
      <P d="M360 340 V230 H450 V340 M360 285 H450" delay={0.48} red />
      <P d="M120 230 H200 M120 215 H200" delay={0.52} thin />
      <Dim d="M90 372 H290" ticks="M90 366 V378 M290 366 V378" text="9 600" x="162" y="368" />
      <Dim d="M46 170 V340" ticks="M40 170 H52 M40 340 H52" text="3 400" x="8" y="262" />
    </>
  )
}

export function Pavilion() {
  return (
    <>
      <Hatch x="130" y="340" w="400" h="14" />
      <P d="M60 340 H580" />
      <P d="M160 340 V200 M320 340 V200 M480 340 V200" delay={0.1} />
      <P d="M110 200 H530" delay={0.2} />
      <P d="M110 200 L320 104 L530 200" delay={0.3} />
      <P d="M160 250 H320 M320 250 H480" delay={0.4} thin />
      <Dim d="M160 372 H480" ticks="M160 366 V378 M480 366 V378" text="4 200" x="300" y="368" />
      <Dim d="M570 200 V340" ticks="M564 200 H576 M564 340 H576" text="2 600" x="520" y="278" />
    </>
  )
}

export function Stair() {
  return (
    <>
      <Hatch x="570" y="90" w="14" h="264" />
      <P d="M60 340 H584" />
      <P d="M90 340 V292 H150 V244 H210 V196 H270 V148 H330 V110 H570" delay={0.1} />
      <P d="M110 262 L340 78" delay={0.3} thin />
      <P d="M90 340 H330" delay={0.2} thin />
      <Dim d="M606 110 V340" ticks="M600 110 H612 M600 340 H612" text="3 150" x="552" y="232" />
      <Dim d="M90 372 H330" ticks="M90 366 V378 M330 366 V378" text="2 400" x="190" y="368" />
    </>
  )
}

export function Flat() {
  return (
    <>
      <P d="M80 90 H560 V330 H80 Z" />
      <P d="M88 98 H552 V322 H88 Z" delay={0.1} thin />
      <P d="M300 98 V230" delay={0.2} red />
      <P d="M300 230 H552" delay={0.26} />
      <P d="M88 230 H190 M240 230 H300" delay={0.3} />
      <P d="M190 230 A50 50 0 0 1 240 180" delay={0.4} thin />
      <P d="M300 150 A40 40 0 0 0 340 190 M300 190 V150" delay={0.45} thin />
      <P d="M140 90 H240 M140 98 H240" delay={0.5} thin />
      <P d="M360 322 H480 M360 330 H480" delay={0.54} thin />
      <Dim d="M80 66 H560" ticks="M80 60 V72 M560 60 V72" text="6 000" x="300" y="60" />
      <Dim d="M600 90 V330" ticks="M594 90 H606 M594 330 H606" text="3 000" x="552" y="214" />
      <g className="ln-dims">
        <text x="150" y="170">комната</text>
        <text x="390" y="170">кухня</text>
        <text x="390" y="290">санузел</text>
      </g>
    </>
  )
}

export function Truss() {
  return (
    <>
      <Hatch x="40" y="336" w="60" h="18" />
      <Hatch x="540" y="336" w="60" h="18" />
      <P d="M70 330 H570" />
      <P d="M70 330 L320 120 L570 330" delay={0.1} />
      <P d="M320 120 V330" delay={0.25} red />
      <P d="M195 225 V330 M445 225 V330" delay={0.3} thin />
      <P d="M195 225 L320 330 M445 225 L320 330" delay={0.4} />
      <circle className="ln-node" cx="320" cy="120" r="4" />
      <circle className="ln-node" cx="195" cy="225" r="4" />
      <circle className="ln-node" cx="445" cy="225" r="4" />
      <Dim d="M70 372 H570" ticks="M70 366 V378 M570 366 V378" text="12 000" x="298" y="368" />
      <Dim d="M610 120 V330" ticks="M604 120 H616 M604 330 H616" text="4 200" x="556" y="230" />
    </>
  )
}

