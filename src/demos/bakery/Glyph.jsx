const SHAPES = {
  loaf: (
    <>
      <path d="M6 32 C6 19 15 12 24 12 S42 19 42 32 V35 H6 Z" />
      <path d="M16 18 l4 9 M24 16 l4 11 M32 18 l-4 9" />
    </>
  ),
  ciabatta: (
    <>
      <rect x="5" y="17" width="38" height="17" rx="8.5" />
      <path d="M14 24 h4 M23 27 h6 M31 22 h4" />
    </>
  ),
  baguette: (
    <>
      <path d="M8 37 L34 11 a4.2 4.2 0 0 1 6 6 L14 43 a4.2 4.2 0 0 1 -6 -6 Z" />
      <path d="M17 29 l5 5 M23 23 l5 5 M29 17 l5 5" />
    </>
  ),
  croissant: (
    <>
      <path d="M5 33 C9 14 39 14 43 33 C37 29 33 31 30.5 35 C27 31 21 31 17.5 35 C15 31 11 29 5 33 Z" />
      <path d="M18 18 L20 30 M30 18 L28 30 M24 16 V28" />
    </>
  ),
  twist: (
    <>
      <rect x="10" y="10" width="28" height="28" rx="4" transform="rotate(45 24 24)" />
      <circle cx="24" cy="24" r="4.5" />
    </>
  ),
  bun: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 24 m0 -3 a3 3 0 1 1 -3 3 a6 6 0 1 1 6 6 a9 9 0 1 1 -9 -9" />
    </>
  ),
  cup: (
    <>
      <path d="M10 18 H34 V28 A10 10 0 0 1 24 38 H20 A10 10 0 0 1 10 28 Z" />
      <path d="M34 21 H38 A4 4 0 0 1 38 29 H34" />
      <path d="M16 8 q2 3 0 6 M23 8 q2 3 0 6" />
    </>
  ),
  glass: (
    <>
      <path d="M14 10 H34 L31 40 H17 Z" />
      <path d="M15 21 H33" />
    </>
  ),
}

export default function Glyph({ name }) {
  return (
    <svg className="bk-glyph" viewBox="0 0 48 48" aria-hidden="true">
      {SHAPES[name]}
    </svg>
  )
}
