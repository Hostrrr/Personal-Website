import { useEffect, useState } from 'react'

export default function useInView(threshold = 0.3) {
  const [node, setNode] = useState(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (!node) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, threshold])

  return [setNode, seen]
}
