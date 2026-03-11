import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

function detectLanguage() {
  const saved = localStorage.getItem('portfolio_language')
  if (saved === 'ru' || saved === 'en') return saved

  const lang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en'
  return lang.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(detectLanguage)

  useEffect(() => {
    localStorage.setItem('portfolio_language', language)
  }, [language])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
