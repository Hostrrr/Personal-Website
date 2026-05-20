import { FaReact, FaHtml5, FaCss3Alt } from 'react-icons/fa'
import { SiExpo, SiPostgresql, SiMysql, SiSqlite, SiRuby, SiDotnet } from 'react-icons/si'
import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useWebHaptics } from 'web-haptics/react'
import Matter from 'matter-js'
import useIsMobile from '../../../hooks/useIsMobile'
import './SkillsWindowContent.css'
const { Engine, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter

const skills = [
  { name: 'React',      icon: <FaReact />,      emojis: ['⚛️','💙','✨'] },
  { name: 'Expo',       icon: <SiExpo />,        emojis: ['📱','🚀','⚡'] },
  { name: 'HTML',       icon: <FaHtml5 />,       emojis: ['🌐','📄','🔴'] },
  { name: 'CSS',        icon: <FaCss3Alt />,     emojis: ['🎨','💅','🌈'] },
  { name: 'C#',         icon: <SiDotnet />,      emojis: ['🎮','🔷','💜'] },
  { name: 'Ruby',       icon: <SiRuby />,        emojis: ['💎','🔴','❤️'] },
  { name: 'PostgreSQL', icon: <SiPostgresql />,  emojis: ['🐘','💾','🗄️'] },
  { name: 'MySQL',      icon: <SiMysql />,       emojis: ['🐬','💾','📊'] },
  { name: 'SQLite',     icon: <SiSqlite />,      emojis: ['🪨','💾','📦'] },
]

const colors = ['#f4f3ef', '#e8e6e1', '#dde8de', '#d4e4ed', '#e8e4dc', '#e5ddd8']

/** Формы: размеры DOM + Matter-тело */
const SKILL_SHAPES = [
  { id: 'circle',    w: 88,  h: 88,  r: 44 },
  { id: 'square',    w: 92,  h: 92,  r: 46 },
  { id: 'triangle',  w: 100, h: 92,  r: 48 },
  { id: 'pill',      w: 118, h: 56,  r: 28 },
  { id: 'hexagon',   w: 96,  h: 96,  r: 46 },
  { id: 'diamond',   w: 90,  h: 90,  r: 44 },
]

const GRID_GAP = 18
const DRAG_THRESHOLD = 8

function createSkillBody(shape, x, y, common) {
  switch (shape.id) {
    case 'circle':
      return Bodies.circle(x, y, shape.r, common)
    case 'square':
      return Bodies.rectangle(x, y, shape.w, shape.h, { ...common, chamfer: { radius: 6 } })
    case 'triangle':
      return Bodies.polygon(x, y, 3, shape.r, common)
    case 'pill':
      return Bodies.rectangle(x, y, shape.w, shape.h, {
        ...common,
        chamfer: { radius: Math.min(shape.w, shape.h) / 2 },
      })
    case 'hexagon':
      return Bodies.polygon(x, y, 6, shape.r, common)
    case 'diamond':
      return Bodies.polygon(x, y, 4, shape.r, { ...common, angle: Math.PI / 4 })
    default:
      return Bodies.rectangle(x, y, shape.w, shape.h, common)
  }
}

function spawnParticles(skill, cx, cy, isMobile) {
  const count = isMobile ? 3 : skill.emojis.length
  const spread = isMobile ? 36 : 52
  const lift = isMobile ? -28 : -18

  return skill.emojis.slice(0, count).map((emoji, i) => {
    const angle = -90 + (i - (count - 1) / 2) * (isMobile ? 28 : 22) + (Math.random() - 0.5) * 10
    const dist = spread + Math.random() * (isMobile ? 16 : 28)
    const rad = angle * (Math.PI / 180)
    return {
      id: Date.now() + i + Math.random(),
      emoji,
      x: cx,
      y: cy,
      dx: Math.cos(rad) * dist,
      dy: Math.sin(rad) * dist + lift,
    }
  })
}

export default function SkillsWindowContent() {
  const isMobile = useIsMobile()
  const { trigger } = useWebHaptics()
  const [particles, setParticles] = useState([])
  const [cardsReady, setCardsReady] = useState(false)
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const bodiesRef = useRef([])
  const draggedRef = useRef(null)
  const dragStartPos = useRef(null)
  const touchActiveRef = useRef(false)
  const touchMovedRef = useRef(false)
  const hapticsPrimedRef = useRef(false)

  const styledSkills = useMemo(() => skills.map((skill, i) => ({
    ...skill,
    color: colors[i % colors.length],
    shape: SKILL_SHAPES[i % SKILL_SHAPES.length],
  })), [])

  const syncCardDom = useCallback((bodies) => {
    bodies.forEach((body, i) => {
      const el = cardRefs.current[i]
      const shape = styledSkills[i]?.shape
      if (!el || !body || !shape) return
      const x = body.position.x - shape.w / 2
      const y = body.position.y - shape.h / 2
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`
    })
  }, [styledSkills])

  const setDraggedCard = useCallback((index) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      el.classList.toggle('is-dragged', i === index)
    })
    draggedRef.current = index
  }, [])

  const primeHaptics = useCallback(() => {
    if (hapticsPrimedRef.current) return
    hapticsPrimedRef.current = true
    trigger(isMobile ? 'selection' : 'light')
  }, [trigger, isMobile])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let W = container.offsetWidth
    let H = container.offsetHeight

    if (!H) {
      H = Math.min(window.innerHeight * 0.55, 520)
      container.style.minHeight = `${H}px`
    }

    const engine = Engine.create({ gravity: { y: isMobile ? 1.1 : 1.6 } })
    const world = engine.world

    const walls = [
      Bodies.rectangle(W / 2, H + 25, W + 100, 50, { isStatic: true, label: 'wall-bottom' }),
      Bodies.rectangle(-25, H / 2, 50, H + 100, { isStatic: true, label: 'wall-left' }),
      Bodies.rectangle(W + 25, H / 2, 50, H + 100, { isStatic: true, label: 'wall-right' }),
    ]
    World.add(world, walls)

    const maxShapeW = Math.max(...SKILL_SHAPES.map(s => s.w))
    const maxShapeH = Math.max(...SKILL_SHAPES.map(s => s.h))
    const cols = Math.max(2, Math.floor(W / (maxShapeW + GRID_GAP)))
    const bodies = styledSkills.map((skill, i) => {
      const { shape } = skill
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = 24 + col * (maxShapeW + GRID_GAP) + shape.w / 2
      const y = -row * (maxShapeH + 22) - shape.h / 2 - 16
      const common = {
        restitution: isMobile ? 0.32 : 0.45,
        friction: isMobile ? 0.08 : 0.06,
        frictionAir: isMobile ? 0.028 : 0.018,
        density: 0.003,
        label: `skill-${i}`,
      }

      const body = createSkillBody(shape, x, y, common)
      body.skillIndex = i
      return body
    })
    World.add(world, bodies)
    bodiesRef.current = bodies

    const mouse = Mouse.create(container)
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

    Events.on(engine, 'beforeUpdate', () => {
      const rect = container.getBoundingClientRect()
      const html = document.documentElement.getBoundingClientRect()
      mouse.offset.x = -(rect.left - html.left)
      mouse.offset.y = -(rect.top - html.top)
    })

    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: isMobile ? 0.14 : 0.2,
        damping: isMobile ? 0.14 : 0.1,
        render: { visible: false },
      },
    })
    World.add(world, mc)

    Events.on(mc, 'startdrag', (e) => {
      setDraggedCard(e.body?.skillIndex ?? null)
    })
    Events.on(mc, 'enddrag', () => {
      setDraggedCard(null)
    })

    const handleTouchStart = (e) => {
      const t = e.changedTouches[0]
      touchActiveRef.current = true
      touchMovedRef.current = false
      dragStartPos.current = { x: t.clientX, y: t.clientY }

      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      mouse.button = 0
      container.dispatchEvent(new MouseEvent('mousedown', {
        clientX: t.clientX,
        clientY: t.clientY,
        bubbles: true,
      }))
    }

    const handleTouchMove = (e) => {
      if (!touchActiveRef.current) return

      const t = e.changedTouches[0]
      if (dragStartPos.current) {
        const dx = t.clientX - dragStartPos.current.x
        const dy = t.clientY - dragStartPos.current.y
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          touchMovedRef.current = true
          e.preventDefault()
        }
      }

      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      container.dispatchEvent(new MouseEvent('mousemove', {
        clientX: t.clientX,
        clientY: t.clientY,
        bubbles: true,
      }))
    }

    const handleTouchEnd = (e) => {
      if (!touchActiveRef.current) return

      const t = e.changedTouches[0]
      if (touchMovedRef.current) e.preventDefault()

      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      mouse.button = -1
      container.dispatchEvent(new MouseEvent('mouseup', {
        clientX: t.clientX,
        clientY: t.clientY,
        bubbles: true,
      }))

      touchActiveRef.current = false
      touchMovedRef.current = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        const newW = container.offsetWidth
        let newH = container.offsetHeight
        if (!newH) {
          newH = Math.min(window.innerHeight * 0.55, 520)
          container.style.minHeight = `${newH}px`
        }
        if (!newW || !newH) return
        World.remove(world, walls)
        walls.length = 0
        walls.push(
          Bodies.rectangle(newW / 2, newH + 25, newW + 100, 50, { isStatic: true }),
          Bodies.rectangle(-25, newH / 2, 50, newH + 100, { isStatic: true }),
          Bodies.rectangle(newW + 25, newH / 2, 50, newH + 100, { isStatic: true }),
        )
        World.add(world, walls)
      })
      resizeObserver.observe(container)
    }

    let raf
    const runner = Runner.create()
    Runner.run(runner, engine)

    const loop = () => {
      raf = requestAnimationFrame(loop)
      syncCardDom(bodies)
    }
    loop()
    setCardsReady(true)

    return () => {
      cancelAnimationFrame(raf)
      Runner.stop(runner)
      Engine.clear(engine)
      World.clear(world, false)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
      resizeObserver?.disconnect()
      setCardsReady(false)
    }
  }, [isMobile, styledSkills, syncCardDom, setDraggedCard])

  const handleTap = useCallback((skill, e, index) => {
    if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x
      const dy = e.clientY - dragStartPos.current.y
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragStartPos.current = null
        return
      }
    }
    dragStartPos.current = null

    trigger(isMobile ? 'nudge' : 'medium')

    const body = bodiesRef.current[index]
    if (body) {
      Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * (isMobile ? 0.008 : 0.015),
        y: isMobile ? -0.018 : -0.025,
      })
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const newParticles = spawnParticles(skill, cx, cy, isMobile)

    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 900)
  }, [trigger, isMobile])

  const particleLayer = (
    <div className="skill-particles-layer" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="skill-particle"
          style={{
            left: p.x,
            top: p.y,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )

  return (
    <div className={`skills-window${isMobile ? ' skills-window--mobile' : ''}`}>
      <div className="skills-physics-container" ref={containerRef}>
        {styledSkills.map((skill, i) => (
          <div
            key={skill.name}
            ref={el => { cardRefs.current[i] = el }}
            className={`skill-card physics-card physics-card--${skill.shape.id}${!cardsReady ? ' physics-card--hidden' : ''}`}
            style={{
              background: skill.color,
              width: skill.shape.w,
              height: skill.shape.h,
            }}
            onPointerDown={(e) => {
              dragStartPos.current = { x: e.clientX, y: e.clientY }
              primeHaptics()
            }}
            onPointerUp={(e) => {
              if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                handleTap(skill, e, i)
              }
            }}
            onClick={(e) => {
              if (e.pointerType === 'touch' || e.pointerType === 'pen') return
              handleTap(skill, e, i)
            }}
          >
            <div className="skill-icon">{skill.icon}</div>
            <div className="skill-name">{skill.name}</div>
          </div>
        ))}
      </div>

      {isMobile
        ? particleLayer
        : ReactDOM.createPortal(particleLayer, document.body)}
    </div>
  )
}
