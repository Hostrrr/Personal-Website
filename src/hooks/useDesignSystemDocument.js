import { useEffect } from 'react'

export function useDesignSystemDocument(designSystem) {
  useEffect(() => {
    document.documentElement.setAttribute('data-design-system', designSystem)
    return () => {
      document.documentElement.removeAttribute('data-design-system')
    }
  }, [designSystem])
}
