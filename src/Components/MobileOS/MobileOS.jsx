import { useCallback, useState } from 'react'
import LockScreen from './LockScreen'
import HomeScreen from './HomeScreen'
import AppScreen from './AppScreen'
import './MobileOS.css'
import { useLanguage } from '../../hooks/useLanguage'
import { OsActionsProvider } from '../../contexts/OsActionsContext'
import { OS_MODULES } from '../../config/osModules'
import { useOsPreferences } from '../../hooks/useOsPreferences'
import useHashRoute, { setHashRoute } from '../../hooks/useHashRoute'
import { playUiOpen } from '../../utils/uiSound'

const APP_IDS = ['about', 'projects', 'skills', 'contact', 'settings', 'game', 'terminal']

export default function MobileOS() {
  const { t } = useLanguage()
  const {
    theme,
    setTheme,
    toggleTheme,
    wallpaperColor,
    setWallpaperColor,
    soundEnabled,
    setSoundEnabled,
  } = useOsPreferences()

  const [screen, setScreen] = useState('locked')
  const [openAppId, setOpenAppId] = useState(null)

  const apps = APP_IDS.map((id) => ({
    id,
    title: t.mobile.appTitles[id],
    moduleId: OS_MODULES[id]?.id,
    accent: OS_MODULES[id]?.accent ?? '#9e9c96',
  }))

  const unlock = () => setScreen('home')

  const openApp = useCallback((appId) => {
    playUiOpen()
    setOpenAppId(appId)
    setScreen('app')
    setHashRoute(appId)
  }, [])

  const goHome = () => {
    setScreen('home')
    setTimeout(() => setOpenAppId(null), 420)
  }

  const currentApp = apps.find((a) => a.id === openAppId) ?? null

  const openByContent = useCallback((content) => {
    if (APP_IDS.includes(content)) {
      if (screen === 'locked') setScreen('home')
      openApp(content)
    }
  }, [openApp, screen])

  useHashRoute(openByContent)

  const osActionsValue = {
    theme,
    setTheme,
    setWallpaperColor,
    openByContent,
    soundEnabled,
    setSoundEnabled,
  }

  return (
    <OsActionsProvider value={osActionsValue}>
    <div className="mobile-os" data-theme={theme}>
      <HomeScreen apps={apps} onOpenApp={openApp} wallpaperColor={wallpaperColor} theme={theme} />

      {openAppId && (
        <AppScreen
          isOpen={screen === 'app'}
          app={currentApp}
          theme={theme}
          onThemeToggle={toggleTheme}
          wallpaperColor={wallpaperColor}
          onWallpaperChange={setWallpaperColor}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          onClose={goHome}
        />
      )}

      <LockScreen isLocked={screen === 'locked'} onUnlock={unlock} />
    </div>
    </OsActionsProvider>
  )
}
