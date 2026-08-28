import { useCallback, useState } from 'react'
import { WALLPAPER_COLORS } from '../utils/osCommands'

const THEME_KEY = 'portfolio_theme'
const WALLPAPER_KEY = 'portfolio_wallpaper'
const SOUND_KEY = 'portfolio_sound'
const DESIGN_SYSTEM_KEY = 'portfolio_design_system'

export const DESIGN_SYSTEMS = ['te', 'apple']

function readTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  return saved === 'dark' || saved === 'light' ? saved : 'light'
}

function readWallpaper() {
  const saved = localStorage.getItem(WALLPAPER_KEY)
  return saved && WALLPAPER_COLORS.includes(saved) ? saved : '#e8e6e1'
}

function readSoundEnabled() {
  return localStorage.getItem(SOUND_KEY) !== 'false'
}

function readDesignSystem() {
  const saved = localStorage.getItem(DESIGN_SYSTEM_KEY)
  return saved === 'apple' || saved === 'te' ? saved : 'te'
}

export function useOsPreferences() {
  const [theme, setThemeState] = useState(readTheme)
  const [wallpaperColor, setWallpaperState] = useState(readWallpaper)
  const [soundEnabled, setSoundEnabledState] = useState(readSoundEnabled)
  const [designSystem, setDesignSystemState] = useState(readDesignSystem)

  const setTheme = useCallback((mode) => {
    if (mode !== 'light' && mode !== 'dark') return
    setThemeState(mode)
    localStorage.setItem(THEME_KEY, mode)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, next)
      return next
    })
  }, [])

  const setWallpaperColor = useCallback((color) => {
    setWallpaperState(color)
    localStorage.setItem(WALLPAPER_KEY, color)
  }, [])

  const setSoundEnabled = useCallback((enabled) => {
    setSoundEnabledState(enabled)
    localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false')
  }, [])

  const setDesignSystem = useCallback((system) => {
    if (system !== 'te' && system !== 'apple') return
    setDesignSystemState(system)
    localStorage.setItem(DESIGN_SYSTEM_KEY, system)
  }, [])

  return {
    theme,
    setTheme,
    toggleTheme,
    wallpaperColor,
    setWallpaperColor,
    soundEnabled,
    setSoundEnabled,
    designSystem,
    setDesignSystem,
  }
}
