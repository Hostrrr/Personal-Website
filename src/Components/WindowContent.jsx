import AboutMeWindowContent from "./windowContent/AboutMeWindowContent/AboutMeWindowContent"
import ContactWindowContent from "./windowContent/ContactWindowContent/ContactWindowContent"
import ProjectsWindowContent from "./windowContent/ProjectsWindowContent/ProjectsWindowContent"
import SkillsWindowContent from "./windowContent/SkillsWindowContent/SkillsWindowContent"
import SettingsWindowContent from "./windowContent/SettingsWindowContent/SettingsWindowContent"
import YegosWindowContent from "./windowContent/YegosWindowContent/YegosWindowContent"
import GameWindowContent from "./windowContent/GameWindowContent/GameWindowContent"
import { useLanguage } from '../contexts/LanguageContext'

export default function WindowContent({ type, theme, onThemeToggle, wallpaperColor, onWallpaperChange }) {
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
      />
    ),
    yegos: <YegosWindowContent />,
    game: <GameWindowContent />,
  }

  return components[type] || <div>{t.windowContent.notFound}</div>
}
