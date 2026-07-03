import { Suspense, lazy } from 'react'
import { useLanguage } from '../hooks/useLanguage'

const AboutMeWindowContent = lazy(() => import('./windowContent/AboutMeWindowContent/AboutMeWindowContent'))
const ContactWindowContent = lazy(() => import('./windowContent/ContactWindowContent/ContactWindowContent'))
const ProjectsWindowContent = lazy(() => import('./windowContent/ProjectsWindowContent/ProjectsWindowContent'))
const SkillsWindowContent = lazy(() => import('./windowContent/SkillsWindowContent/SkillsWindowContent'))
const SettingsWindowContent = lazy(() => import('./windowContent/SettingsWindowContent/SettingsWindowContent'))
const YegosWindowContent = lazy(() => import('./windowContent/YegosWindowContent/YegosWindowContent'))
const GameWindowContent = lazy(() => import('./windowContent/GameWindowContent/GameWindowContent'))
const TerminalWindowContent = lazy(() => import('./windowContent/TerminalWindowContent/TerminalWindowContent'))

function WindowContentFallback() {
  return <div className="window-content-loading">…</div>
}

export default function WindowContent({
  type,
  theme,
  onThemeToggle,
  wallpaperColor,
  onWallpaperChange,
  soundEnabled,
  onSoundToggle,
}) {
  const { t } = useLanguage()

  const components = {
    about: <AboutMeWindowContent />,
    projects: <ProjectsWindowContent />,
    skills: <SkillsWindowContent />,
    contact: <ContactWindowContent />,
    settings: (
      <SettingsWindowContent
        theme={theme}
        onThemeToggle={onThemeToggle}
        wallpaperColor={wallpaperColor}
        onWallpaperChange={onWallpaperChange}
        soundEnabled={soundEnabled}
        onSoundToggle={onSoundToggle}
      />
    ),
    yegos: <YegosWindowContent />,
    game: <GameWindowContent />,
    terminal: <TerminalWindowContent />,
  }

  return (
    <Suspense fallback={<WindowContentFallback />}>
      {components[type] || <div>{t.windowContent.notFound}</div>}
    </Suspense>
  )
}
