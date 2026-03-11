import React from 'react'
import './YegosWindowContent.css'
import AsciiLogoOS from "../../../assets/LogoAscii.txt?raw"
import { useLanguage } from '../../../contexts/LanguageContext'

export default function YegosWindowContent(){
  const { t } = useLanguage()
  return (
    <div className="yegos-section">
      <pre className="ascii-logo-os">{AsciiLogoOS}</pre>
      <p><strong>{t.yegos.version}:</strong> 1.0.0</p>
      <p><strong>{t.yegos.builtWith}:</strong> React</p>
      <p><strong>{t.yegos.author}:</strong> Georgiy Nazarenko</p>
      <p><strong>{t.yegos.status}:</strong> {t.yegos.statusValue}</p>
    </div>
  )
}
