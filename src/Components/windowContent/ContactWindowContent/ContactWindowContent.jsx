import { useState } from 'react'
import './ContactWindowContent.css'
import {
  FaGithub, FaTelegram, FaEnvelope, FaLinkedin,
  FaTimes, FaExternalLinkAlt, FaClock, FaMapMarkerAlt,
  FaCode, FaCopy, FaCheck
} from 'react-icons/fa'
import { useLanguage } from '../../../contexts/LanguageContext'

const CONTACT_BASE = [
  {
    name: 'Email',
    value: 'hosta20259@gmail.com',
    copyValue: 'hosta20259@gmail.com',
    icon: <FaEnvelope />,
    color: '#ff6b6b',
    action: 'mailto:hosta20259@gmail.com',
    openHref: 'mailto:hosta20259@gmail.com',
    button: 'Send',
    detailIcons: [<FaClock />, <FaMapMarkerAlt />],
  },
  {
    name: 'GitHub',
    value: 'github.com/Hostrrr',
    copyValue: 'https://github.com/Hostrrr',
    icon: <FaGithub />,
    color: '#333',
    action: 'https://github.com/Hostrrr',
    openHref: 'https://github.com/Hostrrr',
    button: 'Open',
    detailIcons: [<FaCode />, <FaMapMarkerAlt />],
  },
  {
    name: 'Telegram',
    value: '@merici',
    copyValue: 'https://t.me/merici',
    icon: <FaTelegram />,
    color: '#0088cc',
    action: 'https://t.me/merici',
    openHref: 'https://t.me/merici',
    button: 'Message',
    detailIcons: [<FaClock />, <FaMapMarkerAlt />],
  },
  {
    name: 'LinkedIn',
    value: 'linkedin.com/in/yourprofile',
    copyValue: 'https://linkedin.com/in/yourprofile',
    icon: <FaLinkedin />,
    color: '#0077b5',
    action: 'https://linkedin.com/in/yourprofile',
    openHref: 'https://linkedin.com/in/yourprofile',
    button: 'Open',
    detailIcons: [<FaCode />, <FaMapMarkerAlt />],
  },
]

export default function ContactWindowContent() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(null)

  const contacts = CONTACT_BASE.map((base, i) => ({
    ...base,
    description: t.contact.contacts[i].description,
    details: t.contact.contacts[i].details.map((d, j) => ({
      icon: base.detailIcons[j],
      label: d.label,
      value: d.value,
    })),
    hint: t.contact.contacts[i].hint,
  }))

  const handleSelect = (contact) => {
    if (selected?.name === contact.name) {
      setSelected(null)
    } else {
      setSelected(contact)
    }
  }

  const handleCopy = (e, contact) => {
    e.stopPropagation()
    navigator.clipboard.writeText(contact.copyValue)
    setCopied(contact.name)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <div className="contact-root">
      <div className="contact-list">
        {contacts.map((contact) => (
          <div
            className={`contact-card ${selected?.name === contact.name ? 'contact-card--active' : ''}`}
            key={contact.name}
            onClick={() => handleSelect(contact)}
            style={{ '--accent': contact.color }}
          >
            <div className="contact-icon" style={{ color: contact.color }}>{contact.icon}</div>

            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-value">{contact.value}</div>
            </div>

            <div className="contact-quick-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className={`quick-btn ${copied === contact.name ? 'quick-btn--copied' : ''}`}
                onClick={(e) => handleCopy(e, contact)}
                title={t.contact.copyTitle}
              >
                {copied === contact.name ? <FaCheck /> : <FaCopy />}
              </button>
              <a
                className="quick-btn quick-btn--open"
                href={contact.openHref}
                target="_blank"
                rel="noreferrer"
                title={t.contact.openTitle}
                style={{ '--accent': contact.color }}
              >
                <FaExternalLinkAlt />
              </a>
            </div>

            <div className={`contact-arrow ${selected?.name === contact.name ? 'contact-arrow--open' : ''}`}>›</div>
          </div>
        ))}
      </div>

      <div className={`contact-detail ${selected ? 'contact-detail--open' : ''}`}>
        {selected && (
          <>
            <button className="contact-detail-close" onClick={() => setSelected(null)}>
              <FaTimes />
            </button>

            <div className="detail-header">
              <div className="detail-icon" style={{ color: selected.color }}>{selected.icon}</div>
              <div className="detail-title">{selected.name}</div>
            </div>

            <div className="detail-link-block">
              <span className="detail-link-label">{t.contact.linkLabel}</span>
              <span className="detail-link-value">{selected.copyValue}</span>
            </div>

            <p className="detail-description">{selected.description}</p>

            <div className="detail-facts">
              {selected.details.map((d) => (
                <div className="detail-fact" key={d.label}>
                  <span className="detail-fact-icon" style={{ color: selected.color }}>{d.icon}</span>
                  <div>
                    <div className="detail-fact-label">{d.label}</div>
                    <div className="detail-fact-value">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              className="detail-action"
              href={selected.action}
              target="_blank"
              rel="noreferrer"
              style={{ background: selected.color }}
            >
              {selected.button} <FaExternalLinkAlt style={{ fontSize: 11 }} />
            </a>
          </>
        )}
      </div>
    </div>
  )
}
