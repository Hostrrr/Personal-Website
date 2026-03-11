import { useState } from 'react'
import LockScreen from './LockScreen'
import HomeScreen from './HomeScreen'
import AppScreen from './AppScreen'
import './MobileOS.css'
import { useLanguage } from '../../contexts/LanguageContext'

const APP_IDS = ['about', 'projects', 'skills', 'contact', 'settings', 'game']
const APP_META = {
  about:    { icon: '👤', color: '#FFE566' },
  projects: { icon: '💼', color: '#6BC5FF' },
  skills:   { icon: '⚡', color: '#5AFFA8' },
  contact:  { icon: '📩', color: '#FF6B9D' },
  settings: { icon: '⚙️', color: '#FFA94D' },
  game:     { icon: '🎮', color: '#FF6B6B' },
}

export default function MobileOS() {
  const { t } = useLanguage()
  const [screen, setScreen] = useState('locked')
  const [openAppId, setOpenAppId] = useState(null)
  const [theme, setTheme] = useState('light')
  const [wallpaperColor, setWallpaperColor] = useState('#cdab2f')

  const apps = APP_IDS.map(id => ({
    id,
    title: t.mobile.appTitles[id],
    icon: APP_META[id].icon,
    color: APP_META[id].color,
  }))

  const unlock = () => setScreen('home')

  const openApp = (appId) => {
    setOpenAppId(appId)
    setScreen('app')
  }

  const goHome = () => {
    setScreen('home')
    setTimeout(() => setOpenAppId(null), 420)
  }

  const currentApp = apps.find(a => a.id === openAppId) ?? null

  return (
    <div className="mobile-os" data-theme={theme}>
      <HomeScreen apps={apps} onOpenApp={openApp} wallpaperColor={wallpaperColor} theme={theme} />

      {openAppId && (
        <AppScreen
          isOpen={screen === 'app'}
          app={currentApp}
          theme={theme}
          onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          wallpaperColor={wallpaperColor}
          onWallpaperChange={setWallpaperColor}
          onClose={goHome}
        />
      )}

      <LockScreen isLocked={screen === 'locked'} onUnlock={unlock} />
    </div>
  )
}
