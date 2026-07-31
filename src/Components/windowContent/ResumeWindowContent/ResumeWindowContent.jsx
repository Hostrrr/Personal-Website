import { useCallback, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { useLanguage } from '../../../hooks/useLanguage'
import useIsMobile from '../../../hooks/useIsMobile'
import './ResumeWindowContent.css'

const CONTACTS = [
  { label: 'Email', value: 'hosta20259@gmail.com', href: 'mailto:hosta20259@gmail.com' },
  { label: 'GitHub', value: 'github.com/Hostrrr', href: 'https://github.com/Hostrrr' },
  { label: 'Telegram', value: '@merici', href: 'https://t.me/merici' },
  { label: 'Web', value: 'georgiy-nazarenko.vercel.app', href: 'https://georgiy-nazarenko.vercel.app' },
]

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function buildHtmlDocument(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 24px;
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      color: #1a1a18;
      background: #fff;
      line-height: 1.45;
    }
    h1 { margin: 0 0 4px; font-size: 28px; letter-spacing: -0.02em; }
    .title { margin: 0 0 16px; color: #5b7c99; font-size: 14px; font-weight: 600; }
    .contacts { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 24px; font-size: 13px; }
    .contacts a { color: #1a1a18; }
    h2 {
      margin: 20px 0 8px;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5b7c99;
      border-bottom: 1px solid #d4d2cc;
      padding-bottom: 4px;
    }
    p, li { font-size: 13px; }
    ul { margin: 0; padding-left: 18px; }
    .stack { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip {
      border: 1px solid #d4d2cc;
      border-radius: 2px;
      padding: 3px 8px;
      font-size: 12px;
      background: #f4f3ef;
    }
    .project { margin-bottom: 10px; }
    .project strong { display: block; font-size: 13px; }
    .project span { color: #6b6b66; font-size: 12px; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`
}

export default function ResumeWindowContent() {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const sheetRef = useRef(null)
  const [busy, setBusy] = useState(null)

  const cv = t.resume

  const handlePrint = useCallback(() => {
    document.body.classList.add('printing-resume')
    const cleanup = () => {
      document.body.classList.remove('printing-resume')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
    window.print()
    // Fallback if afterprint doesn't fire (some mobile browsers)
    setTimeout(cleanup, 1000)
  }, [])

  const handleDownloadPng = useCallback(async () => {
    if (!sheetRef.current || busy) return
    setBusy('png')
    try {
      const dataUrl = await toPng(sheetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      downloadBlob('Georgiy-Nazarenko-CV.png', blob)
    } catch {
      /* ignore */
    } finally {
      setBusy(null)
    }
  }, [busy])

  const handleDownloadHtml = useCallback(() => {
    const projectsHtml = cv.projects
      .map(
        (p) => `<div class="project"><strong>${p.name}</strong><span>${p.stack}</span><p>${p.desc}</p></div>`
      )
      .join('')

    const skillsHtml = cv.skillGroups
      .map(
        (group) =>
          `<h2>${group.title}</h2><div class="stack">${group.items
            .map((item) => `<span class="chip">${item}</span>`)
            .join('')}</div>`
      )
      .join('')

    const contactsHtml = CONTACTS.map(
      (c) => `<a href="${c.href}">${c.value}</a>`
    ).join('')

    const body = `
      <h1>${cv.name}</h1>
      <p class="title">${cv.role}</p>
      <div class="contacts">${contactsHtml}</div>
      <h2>${cv.summaryTitle}</h2>
      <p>${cv.summary}</p>
      ${skillsHtml}
      <h2>${cv.projectsTitle}</h2>
      ${projectsHtml}
      <h2>${cv.languagesTitle}</h2>
      <ul>${cv.languages.map((l) => `<li>${l}</li>`).join('')}</ul>
    `

    const html = buildHtmlDocument(`${cv.name} — CV`, body)
    downloadBlob('Georgiy-Nazarenko-CV.html', new Blob([html], { type: 'text/html;charset=utf-8' }))
  }, [cv])

  return (
    <div className={`resume-window${isMobile ? ' resume-window--mobile' : ''}`}>
      <div className="resume-toolbar" role="toolbar" aria-label={cv.toolbarAria}>
        <button type="button" className="resume-btn" onClick={handlePrint}>
          {cv.print}
        </button>
        <button
          type="button"
          className="resume-btn resume-btn--accent"
          onClick={handleDownloadPng}
          disabled={busy === 'png'}
        >
          {busy === 'png' ? cv.downloading : cv.downloadPng}
        </button>
        <button type="button" className="resume-btn" onClick={handleDownloadHtml}>
          {cv.downloadHtml}
        </button>
      </div>

      <div className="resume-scroll">
        <article className="resume-sheet" ref={sheetRef}>
          <header className="resume-sheet__header">
            <div>
              <h1 className="resume-sheet__name">{cv.name}</h1>
              <p className="resume-sheet__role">{cv.role}</p>
            </div>
            <ul className="resume-sheet__contacts">
              {CONTACTS.map((c) => (
                <li key={c.label}>
                  <span className="resume-sheet__contact-label">{c.label}</span>
                  <a href={c.href} target="_blank" rel="noreferrer">
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <section className="resume-section">
            <h2>{cv.summaryTitle}</h2>
            <p>{cv.summary}</p>
          </section>

          {cv.skillGroups.map((group) => (
            <section key={group.title} className="resume-section">
              <h2>{group.title}</h2>
              <div className="resume-chips">
                {group.items.map((item) => (
                  <span key={item} className="resume-chip">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ))}

          <section className="resume-section">
            <h2>{cv.projectsTitle}</h2>
            <ul className="resume-projects">
              {cv.projects.map((project) => (
                <li key={project.name}>
                  <div className="resume-project__head">
                    <strong>{project.name}</strong>
                    <span>{project.stack}</span>
                  </div>
                  <p>{project.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-section">
            <h2>{cv.languagesTitle}</h2>
            <ul className="resume-languages">
              {cv.languages.map((lang) => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  )
}
