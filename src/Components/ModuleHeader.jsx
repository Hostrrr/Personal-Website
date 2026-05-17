import { getModule } from '../config/osModules'
import './ModuleHeader.css'

export default function ModuleHeader({ module, className = '' }) {
  const mod = getModule(module)
  if (!mod) return null

  return (
    <header className={`module-header ${className}`.trim()}>
      <span className="te-label te-label--accent">{mod.id}</span>
      <span className="te-label">{mod.slug}</span>
    </header>
  )
}
