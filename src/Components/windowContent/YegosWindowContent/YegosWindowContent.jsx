import React from 'react'
import './YegosWindowContent.css'
import AsciiLogoOS from "../../../assets/LogoAscii.txt?raw"
import { useLanguage } from '../../../contexts/LanguageContext'
export default function YegosWindowContent(){
  const { t } = useLanguage()
  return (
    <div className="yegos-section">
      <div className="yegos-section__body">
        <pre className="ascii-logo-os">{AsciiLogoOS}</pre>
        <p><strong>{t.yegos.version}</strong> <span>1.0.0</span></p>
        <p><strong>{t.yegos.builtWith}</strong> <span>React</span></p>
        <p><strong>{t.yegos.author}</strong> <span>Georgiy Nazarenko</span></p>
        <p><strong>{t.yegos.status}</strong> <span>{t.yegos.statusValue}</span></p>
      </div>
    </div>
  )
}
