import { FaReact, FaHtml5, FaCss3Alt } from 'react-icons/fa'
import { SiExpo, SiPostgresql, SiMysql, SiSqlite, SiRuby, SiDotnet } from 'react-icons/si'
import { useMemo, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { useWebHaptics } from 'web-haptics/react'
import './SkillsWindowContent.css'

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

export default function SkillsWindowContent() {
  const { trigger } = useWebHaptics()
  const [particles, setParticles] = useState([])

  const styledSkills = useMemo(() => skills.map(skill => ({
    ...skill,
    rotation: Math.floor(Math.random() * 6 - 3),
    radius: Math.floor(Math.random() * 12 + 12),
    color: colors[Math.floor(Math.random() * colors.length)],
  })), [])

  const handleTap = useCallback((skill, e) => {
    trigger('medium')

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
      <div className="skills-container">
        {styledSkills.map(skill => (
          <div
            key={skill.name}
            className="skill-card"
            style={{
              background:    skill.color,
              borderRadius:  `${skill.radius}px`,
              transform:     `rotate(${skill.rotation}deg)`,
            }}
            onClick={(e) => handleTap(skill, e)}
          >
            <div className="skill-icon">{skill.icon}</div>
            <div className="skill-name">{skill.name}</div>
          </div>
        ))}
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
