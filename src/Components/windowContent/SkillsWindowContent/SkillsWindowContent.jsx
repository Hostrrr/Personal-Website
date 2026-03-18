import { FaReact, FaHtml5, FaCss3Alt } from 'react-icons/fa'
import { SiExpo, SiPostgresql, SiMysql, SiSqlite, SiRuby, SiDotnet } from 'react-icons/si'
import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useWebHaptics } from 'web-haptics/react'
import Matter from 'matter-js'
import './SkillsWindowContent.css'

const { Engine, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events } = Matter

const skills = [
  { name: 'React',      icon: <FaReact />,      emojis: ['⚛️','💙','✨','🔵','🎯'] },
  { name: 'Expo',       icon: <SiExpo />,        emojis: ['📱','🚀','📦','⚡','✨'] },
  { name: 'HTML',       icon: <FaHtml5 />,       emojis: ['🌐','📄','🔴','🏗️','✨'] },
  { name: 'CSS',        icon: <FaCss3Alt />,     emojis: ['🎨','💅','🌈','✨','🎭'] },
  { name: 'C#',         icon: <SiDotnet />,      emojis: ['🎮','🔷','💜','⚙️','✨'] },
  { name: 'Ruby',       icon: <SiRuby />,        emojis: ['💎','🔴','❤️','🩷','✨'] },
  { name: 'PostgreSQL', icon: <SiPostgresql />,  emojis: ['🐘','💾','🗄️','🔵','✨'] },
  { name: 'MySQL',      icon: <SiMysql />,       emojis: ['🐬','💾','📊','🔵','✨'] },
  { name: 'SQLite',     icon: <SiSqlite />,      emojis: ['🪨','💾','📦','🔒','✨'] },
]

const colors = ['#FFDE59', '#59C3FF', '#FF8FAB', '#8AFF80', '#FFA94D']

// Размер карточки — синхронизирован с CSS
const CARD_W = 110
const CARD_H = 80

export default function SkillsWindowContent() {
  const { trigger } = useWebHaptics()
  const [particles, setParticles] = useState([])
  const containerRef = useRef(null)

  // Позиции карточек из физики — массив { x, y, angle }
  const [cardTransforms, setCardTransforms] = useState([])

  // Ref для тел Matter, чтобы использовать в обработчиках
  const bodiesRef = useRef([])
  const draggedRef = useRef(null)
  const dragStartPos = useRef(null)

  const DRAG_THRESHOLD = 6 // px

  const styledSkills = useMemo(() => skills.map(skill => ({
    ...skill,
    rotation: Math.floor(Math.random() * 6 - 3),
    radius: Math.floor(Math.random() * 12 + 12),
    color: colors[Math.floor(Math.random() * colors.length)],
  })), [])

  // ── Физика ──────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let W = container.offsetWidth
    let H = container.offsetHeight

    // Если родитель пока не дал высоту — подстраиваемся под окно
    if (!H) {
      H = window.innerHeight || 600
      container.style.minHeight = `${H}px`
    }

    const engine = Engine.create({ gravity: { y: 1.6 } })
    const world = engine.world

    // Стены (невидимые)
    const walls = [
      Bodies.rectangle(W / 2, H + 25, W + 100, 50, { isStatic: true, label: 'wall-bottom' }),
      Bodies.rectangle(-25,   H / 2,  50,  H + 100, { isStatic: true, label: 'wall-left' }),
      Bodies.rectangle(W + 25, H / 2, 50,  H + 100, { isStatic: true, label: 'wall-right' }),
    ]
    World.add(world, walls)

    // Карточки — прямоугольные тела
    const cols = Math.floor(W / (CARD_W + 18)) || 2
    const bodies = styledSkills.map((skill, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      // Стартуют над контейнером с небольшим смещением
      const x = 30 + col * (CARD_W + 18) + CARD_W / 2
      const y = -row * (CARD_H + 24) - CARD_H / 2 - 20
      const common = {
        restitution: 0.45,
        friction: 0.06,
        frictionAir: 0.018,
        density: 0.003,
        label: `skill-${i}`,
      }

      const shapeIndex = i % 3
      let body

      if (shapeIndex === 0) {
        // Круг
        body = Bodies.circle(x, y, 44, common)
      } else if (shapeIndex === 1) {
        // Пилюля
        body = Bodies.rectangle(x, y, CARD_W, 56, {
          ...common,
          chamfer: { radius: 28 },
        })
      } else {
        // Прямоугольник
        body = Bodies.rectangle(x, y, CARD_W, CARD_H, {
          ...common,
          chamfer: { radius: 8 },
        })
      }

      body.skillIndex = i
      return body
    })
    World.add(world, bodies)
    bodiesRef.current = bodies

    // Мышь — вешаем на document, чтобы drag не обрывался при выходе за пределы контейнера.
    // offset корректирует координаты в локальное пространство контейнера.
    const mouse = Mouse.create(document.documentElement)
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)

    // Пересчитываем смещение каждый кадр.
    // Matter считает: (event.pageX - htmlRect.left - scrollX) + offset
    // Нам нужен результат = event.clientX - containerRect.left
    // Поэтому offset = -(containerRect - htmlRect)
    Events.on(engine, 'beforeUpdate', () => {
      const rect = container.getBoundingClientRect()
      const html = document.documentElement.getBoundingClientRect()
      mouse.offset.x = -(rect.left - html.left)
      mouse.offset.y = -(rect.top  - html.top)
    })

    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
    })
    World.add(world, mc)

    // Трекаем какое тело перетаскивается
    Events.on(mc, 'startdrag', (e) => {
      draggedRef.current = e.body?.skillIndex ?? null
    })
    Events.on(mc, 'enddrag', () => {
      draggedRef.current = null
    })

    // Touch — прямой вызов Mouse.setPosition + диспатч
    const handleTouchStart = (e) => {
      e.preventDefault()
      const t = e.changedTouches[0]
      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      mouse.button = 0
      container.dispatchEvent(new MouseEvent('mousedown', { clientX: t.clientX, clientY: t.clientY, bubbles: true }))
    }
    const handleTouchMove = (e) => {
      e.preventDefault()
      const t = e.changedTouches[0]
      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      container.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY, bubbles: true }))
    }
    const handleTouchEnd = (e) => {
      e.preventDefault()
      const t = e.changedTouches[0]
      Mouse.setPosition(mouse, { x: t.clientX, y: t.clientY })
      mouse.button = -1
      container.dispatchEvent(new MouseEvent('mouseup', { clientX: t.clientX, clientY: t.clientY, bubbles: true }))
    }
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove',  handleTouchMove,  { passive: false })
    container.addEventListener('touchend',   handleTouchEnd,   { passive: false })

    // Следим за ресайзом контейнера — обновляем стены и минимальную высоту
    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        const newW = container.offsetWidth
        let newH = container.offsetHeight

        if (!newH) {
          newH = window.innerHeight || 600
          container.style.minHeight = `${newH}px`
        }

        if (!newW || !newH) return

        World.remove(world, walls)

        const newWalls = [
          Bodies.rectangle(newW / 2, newH + 25, newW + 100, 50, { isStatic: true, label: 'wall-bottom' }),
          Bodies.rectangle(-25,      newH / 2,  50, newH + 100, { isStatic: true, label: 'wall-left' }),
          Bodies.rectangle(newW + 25, newH / 2, 50, newH + 100, { isStatic: true, label: 'wall-right' }),
        ]

        World.add(world, newWalls)
      })

      resizeObserver.observe(container)
    }

    // RAF loop — обновляем позиции карточек
    let raf
    const runner = Runner.create()
    Runner.run(runner, engine)

    function loop() {
      raf = requestAnimationFrame(loop)
      setCardTransforms(bodies.map(b => ({
        x: b.position.x - CARD_W / 2,
        y: b.position.y - CARD_H / 2,
        angle: b.angle,
      })))
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      Runner.stop(runner)
      Engine.clear(engine)
      World.clear(world, false)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove',  handleTouchMove)
      container.removeEventListener('touchend',   handleTouchEnd)
      if (resizeObserver) resizeObserver.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Клик / тап ──────────────────────────────────────────────
  const handleTap = useCallback((skill, e, index) => {
    // Разделяем tap и drag по дистанции
    if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x
      const dy = e.clientY - dragStartPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > DRAG_THRESHOLD) {
        dragStartPos.current = null
        return
      }
    }

    dragStartPos.current = null

    trigger('medium')

    // Импульс вверх при тапе — карточка подпрыгивает
    const body = bodiesRef.current[index]
    if (body) {
      Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.015,
        y: -0.025,
      })
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const count = skill.emojis.length
    const newParticles = skill.emojis.map((emoji, i) => {
      const angle = (360 / count) * i + Math.random() * 24 - 12
      const dist  = 55 + Math.random() * 45
      const rad   = angle * (Math.PI / 180)
      return {
        id:    Date.now() + i,
        emoji,
        x:  cx,
        y:  cy,
        dx: Math.cos(rad) * dist,
        dy: Math.sin(rad) * dist,
      }
    })

    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)))
    }, 800)
  }, [trigger])

  return (
    <>
      {/* Контейнер — relative, чтобы карточки позиционировались внутри */}
      <div className="skills-physics-container" ref={containerRef}>

        {/* DOM-карточки позиционируем по данным из физики */}
        {styledSkills.map((skill, i) => {
          const t = cardTransforms[i]
          if (!t) return null

          const isDragged = draggedRef.current === i

          return (
            <div
              key={skill.name}
              className={`skill-card physics-card${isDragged ? ' is-dragged' : ''}`}
              style={{
                background:   skill.color,
                borderRadius:
                  i % 3 === 0
                    ? '50%'
                    : i % 3 === 1
                      ? '999px'
                      : '10px',
                left:  t.x,
                top:   t.y,
                '--physics-rotation': `${t.angle}rad`,
                width:  CARD_W,
                height: CARD_H,
              }}
              onPointerDown={(e) => {
                dragStartPos.current = { x: e.clientX, y: e.clientY }
              }}
              onClick={(e) => handleTap(skill, e, i)}
            >
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
            </div>
          )
        })}
      </div>

      {ReactDOM.createPortal(
        <div className="skill-particles-layer" aria-hidden="true">
          {particles.map(p => (
            <span
              key={p.id}
              className="skill-particle"
              style={{
                left:   p.x,
                top:    p.y,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
