import { useEffect, useState } from 'react'

function isEditableTarget(target) {
  if (!target) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useCommandPaletteToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState(0)

  const bumpSession = () => setSession(s => s + 1)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
      if (isEditableTarget(e.target)) return

      e.preventDefault()
      setIsOpen(prev => {
        if (!prev) bumpSession()
        return !prev
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const open = () => {
    bumpSession()
    setIsOpen(true)
  }

  const toggle = () => {
    setIsOpen(prev => {
      if (!prev) bumpSession()
      return !prev
    })
  }

  return {
    isOpen,
    session,
    open,
    close: () => setIsOpen(false),
    toggle,
  }
}
