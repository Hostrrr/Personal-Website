import { useState } from 'react'
import LockScreen from './LockScreen'
import HomeScreen from './HomeScreen'
import AppScreen from './AppScreen'
import './MobileOS.css'
import { useLanguage } from '../../contexts/LanguageContext'
import { OsActionsProvider } from '../../contexts/OsActionsContext'
import { OS_MODULES } from '../../config/osModules'
import { playUiOpen } from '../../utils/uiSound'

const APP_IDS = ['about', 'projects', 'skills', 'contact', 'settings', 'game', 'terminal']

export default function MobileOS() {
  const { t } = useLanguage()
  const [screen, setScreen] = useState('locked')
  const [openAppId, setOpenAppId] = useState(null)
  const [theme, setThemeMode] = useState('light')
  const [wallpaperColor, setWallpaperColor] = useState('#e8e6e1')

  const setTheme = (mode) => setThemeMode(mode)

  const apps = APP_IDS.map(id => ({
    id,
    title: t.mobile.appTitles[id],
    moduleId: OS_MODULES[id]?.id,
    accent: OS_MODULES[id]?.accent ?? '#9e9c96',
  }))

  const unlock = () => setScreen('home')

  const openApp = (appId) => {
    playUiOpen()
    setOpenAppId(appId)
    setScreen('app')
  }

  const goHome = () => {
    setScreen('home')
    setTimeout(() => setOpenAppId(null), 420)
  }

  const currentApp = apps.find(a => a.id === openAppId) ?? null

  const openByContent = (content) => {
    if (APP_IDS.includes(content)) openApp(content)
  }

  const osActionsValue = {
    theme,
    setTheme,
    setWallpaperColor,
    openByContent,
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
          onThemeToggle={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
          wallpaperColor={wallpaperColor}
          onWallpaperChange={setWallpaperColor}
          onClose={goHome}
        />
      )}

      <LockScreen isLocked={screen === 'locked'} onUnlock={unlock} />
    </div>
    </OsActionsProvider>
  )
}
