/** Module map — Teenage Engineering–style numbering */
export const OS_MODULES = {
  about:    { id: '01', slug: 'profile', accent: '#4a8fd4' },
  projects: { id: '02', slug: 'archive', accent: '#ff5500' },
  skills:   { id: '03', slug: 'skills',  accent: '#5cb88a' },
  contact:  { id: '04', slug: 'comms',   accent: '#e88fa8' },
  yegos:    { id: '00', slug: 'system',  accent: '#9e9c96' },
  settings: { id: '99', slug: 'config',  accent: '#e8c547' },
  game:     { id: '07', slug: 'play',    accent: '#e04545' },
  terminal: { id: '08', slug: 'shell',   accent: '#5a7a5a' },
}

export function getModule(content) {
  return OS_MODULES[content] ?? null
}

export function formatWindowTitle(content, label) {
  const mod = getModule(content)
  if (!mod) return label
  return `${mod.id} · ${label}`
}
