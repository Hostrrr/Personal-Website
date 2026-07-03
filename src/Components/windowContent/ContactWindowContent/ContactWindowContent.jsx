import { useState } from 'react'
import './ContactWindowContent.css'
import {
  FaGithub, FaTelegram, FaEnvelope, FaLinkedin,
  FaTimes, FaExternalLinkAlt, FaClock, FaMapMarkerAlt,
  FaCode, FaCopy, FaCheck
} from 'react-icons/fa'
import { useLanguage } from '../../../hooks/useLanguage'
import { copyToClipboard } from '../../../utils/clipboard'

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
].filter(Boolean)

const LINKEDIN_PROFILE = ''

const linkedInContact = LINKEDIN_PROFILE ? {
  name: 'LinkedIn',
  value: LINKEDIN_PROFILE.replace('https://', ''),
  copyValue: LINKEDIN_PROFILE.startsWith('http') ? LINKEDIN_PROFILE : `https://${LINKEDIN_PROFILE}`,
  icon: <FaLinkedin />,
  color: '#0077b5',
  action: LINKEDIN_PROFILE.startsWith('http') ? LINKEDIN_PROFILE : `https://${LINKEDIN_PROFILE}`,
  openHref: LINKEDIN_PROFILE.startsWith('http') ? LINKEDIN_PROFILE : `https://${LINKEDIN_PROFILE}`,
  button: 'Open',
  detailIcons: [<FaCode />, <FaMapMarkerAlt />],
} : null

const ALL_CONTACTS = linkedInContact ? [...CONTACT_BASE, linkedInContact] : CONTACT_BASE

export default function ContactWindowContent() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(null)

  const contacts = ALL_CONTACTS.map((base, i) => ({
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

  const handleCopy = async (e, contact) => {
    e.stopPropagation()
    const ok = await copyToClipboard(contact.copyValue)
    if (ok) {
      setCopied(contact.name)
      setTimeout(() => setCopied(null), 1800)
    }
  }

  return (
    <div className="contact-root">
      <div className="contact-body">
      <div className="contact-list">
        {contacts.map((contact) => (
          <div
            className={`contact-card ${selected?.name === contact.name ? 'contact-card--active' : ''}`}
            key={contact.name}
            onClick={() => handleSelect(contact)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSelect(contact)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ '--accent': contact.color }}
          >
            <div className="contact-icon" style={{ color: contact.color }}>{contact.icon}</div>

            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-value">{contact.value}</div>
            </div>

            <div className="contact-quick-actions" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
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
                rel="noopener noreferrer"
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
            <button type="button" className="contact-detail-close" onClick={() => setSelected(null)}>
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
              rel="noopener noreferrer"
              style={{ background: selected.color }}
            >
              {selected.button} <FaExternalLinkAlt style={{ fontSize: 11 }} />
            </a>
          </>
        )}
      </div>
      </div>
    </div>
  )
}
