import { useEffect } from 'react'
import { OPENABLE_CONTENT } from '../utils/osCommands'

export function setHashRoute(content) {
  if (!content || !OPENABLE_CONTENT.includes(content)) return
  const next = `#${content}`
  if (window.location.hash !== next) {
    window.location.hash = content
  }
}

export function clearHashRoute() {
  if (!window.location.hash) return
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

export default function useHashRoute(onOpen) {
  useEffect(() => {
    const openFromHash = () => {
      const content = window.location.hash.slice(1)
      if (content && OPENABLE_CONTENT.includes(content)) {
        onOpen(content)
      }
    }

    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [onOpen])
}
