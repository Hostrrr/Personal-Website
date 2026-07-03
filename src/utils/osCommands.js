import { OS_MODULES } from '../config/osModules'

export const WALLPAPER_COLORS = [
  '#e8e6e1',
  '#d4e4ed',
  '#e5ddd8',
  '#dde8de',
  '#e8e4dc',
  '#c9c7c2',
  '#f4f3ef',
  '#2a2a28',
]

/** All openable content keys */
export const OPENABLE_CONTENT = [
  'about',
  'projects',
  'skills',
  'contact',
  'yegos',
  'settings',
  'game',
  'terminal',
]

/** Map alias → content key */
export const CONTENT_ALIASES = (() => {
  const map = {}
  for (const key of OPENABLE_CONTENT) {
    map[key] = key
    const mod = OS_MODULES[key]
    if (mod) {
      map[mod.id] = key
      map[mod.slug] = key
    }
  }
  map.contacts = 'contact'
  map.games = 'game'
  map.snake = 'game'
  map.shell = 'terminal'
  map['08'] = 'terminal'
  return map
})()

export function resolveContent(target) {
  if (!target) return null
  const normalized = target.toLowerCase().trim()
  return CONTENT_ALIASES[normalized] ?? null
}

function openContent(ctx, content) {
  const label = ctx.t.windows[content] || content
  ctx.openByContent(content)
  return { lines: [ctx.t.terminal.opened.replace('{app}', label)], ok: true }
}

function setTheme(ctx, mode) {
  const current = ctx.theme
  let next = mode

  if (mode === 'toggle') {
    next = current === 'light' ? 'dark' : 'light'
  }

  if (next !== 'light' && next !== 'dark') {
    return { lines: [ctx.t.terminal.themeUsage], ok: false }
  }

  if (next !== current) {
    ctx.setTheme(next)
  }

  const label = next === 'dark' ? ctx.t.settings.themeDark : ctx.t.settings.themeLight
  return { lines: [ctx.t.terminal.themeSet.replace('{theme}', label)], ok: true }
}

function setLang(ctx, code) {
  if (code !== 'ru' && code !== 'en') {
    return { lines: [ctx.t.terminal.langUsage], ok: false }
  }

  ctx.setLanguage(code)
  const label = code === 'ru' ? 'Русский' : 'English'
  return { lines: [ctx.t.terminal.langSet.replace('{lang}', label)], ok: true }
}

function setWallpaper(ctx, indexStr) {
  const index = Number(indexStr)
  if (!indexStr || Number.isNaN(index) || index < 1 || index > WALLPAPER_COLORS.length) {
    return { lines: [ctx.t.terminal.wallpaperUsage], ok: false }
  }

  const color = WALLPAPER_COLORS[index - 1]
  const label = ctx.t.settings.wallpapers[index - 1]
  ctx.setWallpaperColor(color)
  return { lines: [ctx.t.terminal.wallpaperSet.replace('{name}', label)], ok: true }
}

export function executeCommand(input, ctx) {
  const trimmed = input.trim()
  if (!trimmed) return { lines: [], ok: true }

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const arg = parts.slice(1).join(' ')

  if (cmd === 'help') {
    return { lines: ctx.t.terminal.helpLines, ok: true }
  }

  if (cmd === 'clear') {
    return { lines: [], ok: true, clear: true }
  }

  if (cmd === 'open') {
    const content = resolveContent(arg)
    if (!content) return { lines: [ctx.t.terminal.notFound.replace('{cmd}', arg || '?')], ok: false }
    return openContent(ctx, content)
  }

  if (cmd === 'theme') {
    return setTheme(ctx, arg || 'toggle')
  }

  if (cmd === 'lang') {
    return setLang(ctx, arg)
  }

  if (cmd === 'wallpaper') {
    return setWallpaper(ctx, arg)
  }

  if (cmd === 'version') {
    return { lines: ['YegOS 1.0.0'], ok: true }
  }

  if (cmd === 'whoami') {
    return { lines: [ctx.t.about.name], ok: true }
  }

  const shortcut = resolveContent(cmd)
  if (shortcut) {
    return openContent(ctx, shortcut)
  }

  return { lines: [ctx.t.terminal.notFound.replace('{cmd}', cmd)], ok: false }
}

export function getCommandList(ctx) {
  const items = []

  for (const content of OPENABLE_CONTENT) {
    const mod = OS_MODULES[content]
    const label = ctx.t.windows[content] || content
    items.push({
      id: `open-${content}`,
      label,
      code: mod?.id,
      keywords: [content, mod?.slug, mod?.id].filter(Boolean).join(' '),
      run: () => executeCommand(content, ctx),
    })
  }

  items.push({
    id: 'theme-toggle',
    label: ctx.t.terminal.paletteTheme,
    keywords: 'theme dark light toggle',
    run: () => executeCommand('theme toggle', ctx),
  })

  items.push({
    id: 'lang-ru',
    label: ctx.t.terminal.paletteLangRu,
    keywords: 'lang ru russian русский',
    run: () => executeCommand('lang ru', ctx),
  })

  items.push({
    id: 'lang-en',
    label: ctx.t.terminal.paletteLangEn,
    keywords: 'lang en english',
    run: () => executeCommand('lang en', ctx),
  })

  return items
}

export function buildCommandContext({ t, theme, setTheme, setLanguage, setWallpaperColor, openByContent }) {
  return { t, theme, setTheme, setLanguage, setWallpaperColor, openByContent }
}
