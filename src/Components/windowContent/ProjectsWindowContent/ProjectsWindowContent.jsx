import './ProjectsWindowContent.css'
import img1 from '../../../assets/ProjectScreenshots/PortfolioOS.png'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import { useState } from 'react'
import { useLanguage } from '../../../contexts/LanguageContext'

const PROJECTS_BASE = [
  {
    title: "Portfolio OS",
    stack: "React / CSS",
    github: "#",
    live: "#",
    imgpath: img1,
    emoji: "🖥️"
  },
  {
    title: "Period Tracker CLI",
    stack: "Python CLI",
    github: "#",
    imgpath: "",
    emoji: "🌸"
  },
  {
    title: "Unity Game",
    stack: "Unity / C#",
    github: "#",
    imgpath: "",
    emoji: "🎯"
  },
]

export default function ProjectsWindowContent() {
  const { t } = useLanguage()
  const [searchText, setSearchText] = useState("")
  const [currentProject, setCurrentProject] = useState(null)

  const projects = PROJECTS_BASE.map((base, i) => ({
    ...base,
    desc: t.projects.projects[i].desc,
  }))

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchText.toLowerCase()) ||
    p.stack.toLowerCase().includes(searchText.toLowerCase())
  )

  const urlPath = currentProject
    ? `/projects/${currentProject.title.toLowerCase().replace(/\s/g, '-')}`
    : '/projects'

  return (
    <div className="projects-browser-content">
      {/* Desktop browser bar */}
      <div className="browser-bar desktop-browser-bar">
        <div className="browser-nav">
          <button onClick={() => setCurrentProject(null)} disabled={!currentProject}>
            <FaArrowLeft />
          </button>
        </div>
        <div className="browser-address">{urlPath}</div>
      </div>

      {/* Mobile URL bar */}
      <div className="mobile-browser-bar">
        {currentProject && (
          <button className="mobile-back-btn" onClick={() => setCurrentProject(null)}>
            <FaArrowLeft />
          </button>
        )}
        <div className="mobile-url-pill">
          <span className="mobile-url-icon">🌐</span>
          <span className="mobile-url-text">{urlPath}</span>
        </div>
      </div>

      {!currentProject && (
        <div className="searchbar-section">
          <h1>Joooooogle</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder={t.projects.searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button>🔍</button>
          </div>
        </div>
      )}

      <div className="browser-page">
        {!currentProject && (
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((p, i) => (
                <div
                  key={i}
                  className="project-card"
                  onClick={() => setCurrentProject(p)}
                >
                  <div className="project-card-emoji">{p.emoji}</div>
                  <div className="project-card-info">
                    <div className="project-title">{p.title}</div>
                    <div className="project-stack">{p.stack}</div>
                  </div>
                  <div className="project-card-arrow">›</div>
                </div>
              ))
            ) : (
              <p>{t.projects.notFound}</p>
            )}
          </div>
        )}

        {currentProject && (
          <div className="project-view">
            {currentProject.imgpath && (
              <img
                src={currentProject.imgpath}
                alt={currentProject.emoji}
                className="projectImage"
              />
            )}
            <h3>{currentProject.title}</h3>
            <p>{currentProject.desc}</p>
            <div className="project-links">
              {currentProject.github && <a href={currentProject.github}><FaGithub /> Code</a>}
              {currentProject.live && <a href={currentProject.live}><FaExternalLinkAlt /> Live</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
