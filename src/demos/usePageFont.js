import { useEffect } from 'react'

export default function usePageFont(href) {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
    return () => link.remove()
  }, [href])
}
